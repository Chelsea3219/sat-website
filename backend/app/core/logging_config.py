# app/core/logging_config.py
import json
import logging
import os
from datetime import datetime, timezone
from logging.handlers import RotatingFileHandler

_STANDARD_ATTRS = set(vars(logging.LogRecord("", 0, "", 0, "", (), None))) | {"message", "asctime"}


class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_entry = {
            "timestamp": datetime.fromtimestamp(record.created, tz=timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "file": record.filename,
            "function": record.funcName,
            "line": record.lineno,
        }
        # Include anything passed via extra={...}
        for key, value in vars(record).items():
            if key not in _STANDARD_ATTRS and not key.startswith("_"):
                log_entry[key] = value
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_entry, default=str)


def setup_logging(level: int = logging.INFO) -> None:
    root = logging.getLogger()
    if getattr(root, "_app_configured", False):
        return                                   # already set up in this process
    root._app_configured = True

    formatter = JSONFormatter()

    stream_handler = logging.StreamHandler()     # stdout/stderr: what Render shows in Logs
    stream_handler.setFormatter(formatter)
    root.addHandler(stream_handler)

    log_file = os.getenv("LOG_FILE")             # set only locally, e.g. LOG_FILE=logs/app.log
    if log_file:
        os.makedirs(os.path.dirname(log_file) or ".", exist_ok=True)
        file_handler = RotatingFileHandler(log_file, maxBytes=5_000_000, backupCount=3)
        file_handler.setFormatter(formatter)
        root.addHandler(file_handler)

    root.setLevel(level)

    for noisy in ("httpx", "httpcore", "sqlalchemy.engine", "urllib3"):
        logging.getLogger(noisy).setLevel(logging.WARNING)
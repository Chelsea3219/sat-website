
"""
Run this from your backend/ root:
    python add_logger.py

Adds `import logging` + `logger = logging.getLogger(__name__)`
to any .py file that calls logger.<something> but doesn't already
import/define a logger.
"""
import re
from pathlib import Path

root = Path(".")
changed = []

for path in root.rglob("*.py"):
    text = path.read_text()

    uses_logger = re.search(r"\blogger\.\w+\(", text)
    already_has_logger = "getLogger(__name__)" in text

    if uses_logger and not already_has_logger:
        lines = text.splitlines()

        # Find where imports end (first non-import, non-blank, non-comment line)
        insert_at = 0
        for i, line in enumerate(lines):
            stripped = line.strip()
            if stripped.startswith(("import ", "from ")) or stripped == "" or stripped.startswith("#"):
                insert_at = i + 1
            else:
                break

        needs_import_logging = "import logging" not in text
        new_lines = []
        if needs_import_logging:
            new_lines.append("import logging")
        new_lines.append("")
        new_lines.append("logger = logging.getLogger(__name__)")
        new_lines.append("")

        lines[insert_at:insert_at] = new_lines
        path.write_text("\n".join(lines))
        changed.append(str(path))

print(f"Updated {len(changed)} files:")
for c in changed:
    print(" -", c)

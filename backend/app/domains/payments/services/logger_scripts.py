
def is_checkout_complete(obj):
    return [
        "Checkout completed: session=%s mode=%s payment_status=%s "
        "customer=%s metadata=%s",
        obj.get("id"),
        obj.get("mode"),
        obj.get("payment_status"),
        obj.get("customer"),
        obj.get("metadata"),
    ]
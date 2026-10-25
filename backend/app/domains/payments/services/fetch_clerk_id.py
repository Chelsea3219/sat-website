import stripe 


def clerk_id_for(customer_id: str) -> str:
    """
    TODO Minor: stripe.Customer.retrieve is a blocking call inside an async endpoint, so it
    holds up the server while waiting for Stripe. That’s fine at your current volume. If webhooks 
    pile up later, run it with await asyncio.to_thread(stripe.Customer.retrieve, customer_id).
    """
    return stripe.Customer.retrieve(customer_id).metadata["clerkUserId"]
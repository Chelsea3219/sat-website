

// Sends the purchaseItem to start checkout
export async function purchaseProduct(product: string ) {

    try {
        const response = await fetch(`/api/stripe/checkout`, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({product})
        })

        const data = await response.json().catch(() => null)

        if (!response.ok) {
            const data = await response.json().catch(() => null)
            console.error("FastAPI checkout error.", { status: response.status, details: data })

            if (response.status === 401) { 
                // Redirect to pricing page 
                window.location.href = `/sign-in?redirect_url=${encodeURIComponent("/pricing")}` 
                return
            }   
            throw new Error(
                data?.detail
                    ? JSON.stringify(data.detail)
                    : data?.error ?? "Checkout failed"
            )
        }

        if (!data?.url) throw new Error("Stripe dud not retyrn a checkout URL.")
        window.location.href = data.url 
    } catch (error) {
        console.error("Checkout error:", error )
    }
}
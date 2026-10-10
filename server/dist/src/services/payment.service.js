import { env } from "../config/env.js";
import { AppError } from "../middleware/error.middleware.js";
export const initializePaystackPayment = async (data) => {
    const response = await fetch(`${env.PAYSTACK_BASE_URL}/transaction/initialize`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: data.email,
            // Paystack expects kobo
            amount: Math.round(data.amount * 100),
            reference: data.reference,
            callback_url: `${env.CLIENT_URL}/payment/callback`,
            metadata: JSON.stringify({
                reference: data.reference,
            }),
        }),
    });
    const result = await response.json();
    if (!response.ok || !result.status) {
        throw new AppError(result.message || "Unable to initialize payment", 502);
    }
    return result.data;
};
export const verifyPaystackPayment = async (reference) => {
    const response = await fetch(`${env.PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
        headers: {
            Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
        },
    });
    const result = await response.json();
    if (!response.ok || !result.status) {
        throw new AppError(result.message || "Unable to verify payment", 502);
    }
    return result.data;
};
//# sourceMappingURL=payment.service.js.map
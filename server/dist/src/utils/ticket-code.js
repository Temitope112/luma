import crypto from "crypto";
export const generateOrderReference = () => {
    return `LUMA-${Date.now()}-${crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase()}`;
};
export const generateTicketCode = () => {
    return `TKT-${crypto
        .randomBytes(8)
        .toString("hex")
        .toUpperCase()}`;
};

// src/utils/invoice.ts
export const VAT_RATE = 0.14; // 14% VAT — change if needed

export const calcInvoiceTotals = (items: { qty: number; price: number }[], paid = 0) => {
    const subtotal = items.reduce((s, it) => s + (it.qty * it.price), 0);
    const vat = +(subtotal * VAT_RATE);
    const total = +(subtotal + vat);
    const due = +(total - paid);
    return { subtotal: +subtotal.toFixed(2), vat: +vat.toFixed(2), total: +total.toFixed(2), due: +due.toFixed(2) };
};

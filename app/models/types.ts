// src/models/types.ts
export type Category = {
    id?: number;
    name: string;
};

export type Item = {
    id?: number;
    name: string;
    category_id?: number | null;
    price: number;
    quantity: number;
};

export type Customer = {
    id?: number;
    name: string;
    phone: string;
    email?: string | null;
};

export type InvoiceItem = {
    id?: number;
    invoice_id?: number;
    item_id: number;
    qty: number;
    price: number;
    amount?: number;
};

export type Invoice = {
    id?: number;
    invoice_no: string;
    customer_id?: number | null;
    date: string;
    subtotal: number;
    vat: number;
    total: number;
    paid: number;
    due: number;
};

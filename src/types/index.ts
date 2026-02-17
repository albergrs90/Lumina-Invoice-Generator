export type TemplateType = 'modern' | 'corporate' | 'creative';
export type CurrencyCode = 'EUR' | 'USD' | 'MXN' | 'GBP';

export interface InvoiceItem {
    id: string;
    desc: string;
    qty: number;
    price: number; // In centavos
}

export interface SenderInfo {
    name: string;
    taxId: string;
    address: string;
    email: string;
    phone: string;
    logo: string; // Base64
}

export interface ReceiverInfo {
    name: string;
    taxId: string;
    address: string;
    email: string;
}

export interface InvoiceSettings {
    currency: CurrencyCode;
    taxRate: number; // Percentage (e.g., 21)
    template: TemplateType;
}

export interface InvoiceTotals {
    subtotal: number; // In centavos
    taxAmount: number; // In centavos
    total: number; // In centavos
}

export interface InvoiceData {
    number: string;
    issueDate: string;
    dueDate: string;
    sender: SenderInfo;
    receiver: ReceiverInfo;
    items: InvoiceItem[];
    settings: InvoiceSettings;
    totals: InvoiceTotals;
    notes: string;
    paymentMethod: string;
}

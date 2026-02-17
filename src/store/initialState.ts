import { InvoiceData, InvoiceItem, SenderInfo, ReceiverInfo, InvoiceSettings } from '../types';

export type { InvoiceData, InvoiceItem, SenderInfo, ReceiverInfo, InvoiceSettings };

export const invoiceInitialState: InvoiceData = {
    number: 'INV-001',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    sender: {
        name: '',
        taxId: '',
        address: '',
        email: '',
        phone: '',
        logo: '',
    },
    receiver: {
        name: '',
        taxId: '',
        address: '',
        email: '',
    },
    items: [
        {
            id: crypto.randomUUID(),
            desc: 'Ejemplo de servicio',
            qty: 1,
            price: 0,
        }
    ],
    settings: {
        currency: 'EUR',
        taxRate: 21,
        template: 'modern',
    },
    totals: {
        subtotal: 0,
        taxAmount: 0,
        total: 0,
    },
    notes: '',
    paymentMethod: 'Transferencia bancaria',
};

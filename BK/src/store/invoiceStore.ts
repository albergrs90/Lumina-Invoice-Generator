import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InvoiceItem, SenderInfo, ReceiverInfo, InvoiceSettings, InvoiceData } from '../types';
import { invoiceInitialState } from './initialState';
import { calculateTotals } from '../utils/calculations';

interface InvoiceState extends InvoiceData {
    updateSender: (sender: Partial<SenderInfo>) => void;
    updateReceiver: (receiver: Partial<ReceiverInfo>) => void;
    updateSettings: (settings: Partial<InvoiceSettings>) => void;
    addItem: (item: InvoiceItem) => void;
    removeItem: (id: string) => void;
    updateItem: (id: string, item: Partial<InvoiceItem>) => void;
    updateInvoiceNumber: (number: string) => void;
    updateDates: (issueDate: string, dueDate: string) => void;
    updateNotes: (notes: string) => void;
    updatePaymentMethod: (method: string) => void;
    reorderItems: (startIndex: number, endIndex: number) => void;
    saveClient: (client: ReceiverInfo) => void;
    resetInvoice: () => void;
    clientHistory: ReceiverInfo[];
}

export const useInvoiceStore = create<InvoiceState>()(
    persist(
        (set) => ({
            ...invoiceInitialState,

            updateSender: (sender) =>
                set((state) => ({ sender: { ...state.sender, ...sender } })),

            updateReceiver: (receiver) =>
                set((state) => ({ receiver: { ...state.receiver, ...receiver } })),

            updateSettings: (settings) =>
                set((state) => {
                    const newSettings = { ...state.settings, ...settings };
                    const newTotals = calculateTotals(state.items, newSettings.taxRate);
                    return { settings: newSettings, totals: newTotals };
                }),

            addItem: (item) =>
                set((state) => {
                    const newItems = [...state.items, item];
                    const newTotals = calculateTotals(newItems, state.settings.taxRate);
                    return { items: newItems, totals: newTotals };
                }),

            removeItem: (id) =>
                set((state) => {
                    const newItems = state.items.filter((item) => item.id !== id);
                    const newTotals = calculateTotals(newItems, state.settings.taxRate);
                    return { items: newItems, totals: newTotals };
                }),

            updateItem: (id, updatedItem) =>
                set((state) => {
                    const newItems = state.items.map((item) =>
                        item.id === id ? { ...item, ...updatedItem } : item
                    );
                    const newTotals = calculateTotals(newItems, state.settings.taxRate);
                    return { items: newItems, totals: newTotals };
                }),

            updateInvoiceNumber: (number) => set({ number }),

            updateDates: (issueDate, dueDate) => set({ issueDate, dueDate }),

            updateNotes: (notes) => set({ notes }),

            updatePaymentMethod: (paymentMethod) => set({ paymentMethod }),

            reorderItems: (startIndex, endIndex) =>
                set((state) => {
                    const result = Array.from(state.items);
                    const [removed] = result.splice(startIndex, 1);
                    result.splice(endIndex, 0, removed);
                    return { items: result };
                }),

            saveClient: (client) =>
                set((state) => {
                    const exists = state.clientHistory.find(c => c.name === client.name);
                    if (exists) return state;
                    return { clientHistory: [client, ...state.clientHistory].slice(0, 10) };
                }),

            resetInvoice: () => set((state) => ({
                ...state,
                ...invoiceInitialState,
                clientHistory: state.clientHistory // Keep history after reset
            })),

            clientHistory: [],
        }),
        {
            name: 'lumina-invoice-storage',
        }
    )
);

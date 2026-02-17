import { InvoiceItem, InvoiceTotals } from '../types';
import Decimal from 'decimal.js';

/**
 * Calculates invoice totals from items and tax rate.
 * Uses centavos (integers) or Decimal.js to avoid floating point issues.
 */
export const calculateTotals = (items: InvoiceItem[], taxRate: number): InvoiceTotals => {
    const subtotal = items.reduce((acc, item) => {
        // qty * price (both are numbers, price in centavos)
        return acc + Math.round(item.qty * item.price);
    }, 0);

    // Use Decimal.js for tax calculation to ensure precision
    const subtotalDecimal = new Decimal(subtotal);
    const taxRateDecimal = new Decimal(taxRate).div(100);

    const taxAmount = subtotalDecimal.mul(taxRateDecimal).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber();
    const total = subtotal + taxAmount;

    return {
        subtotal,
        taxAmount,
        total
    };
};

/**
 * Converts a decimal number (like 1200.50) to centavos (120050).
 */
export const toCentavos = (value: number | string): number => {
    return new Decimal(value).mul(100).toDecimalPlaces(0).toNumber();
};

/**
 * Converts centavos (120050) back to a decimal number (1200.50).
 */
export const fromCentavos = (centavos: number): number => {
    return new Decimal(centavos).div(100).toNumber();
};

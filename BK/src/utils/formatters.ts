import { CurrencyCode } from '../types';

const CURRENCY_LOCALES: Record<CurrencyCode, string> = {
    EUR: 'es-ES',
    USD: 'en-US',
    MXN: 'es-MX',
    GBP: 'en-GB'
};

/**
 * Formats a centavos value into a currency string.
 */
export const formatCurrency = (centavos: number, currency: CurrencyCode): string => {
    const value = centavos / 100;
    const formatted = new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);

    // Add a space before the symbol if it's at the end
    // or after the symbol if it's at the start, to ensure spacing in PDF capture
    // Force "X,XX €" format for EUR with a non-breaking space if possible
    // or just a regular space to satisfy the rule.
    if (currency === 'EUR') {
        const parts = new Intl.NumberFormat('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
        return `${parts} €`;
    }

    return formatted
        .replace(/([0-9])([€$£])/, '$1 $2')
        .replace(/([€$£])([0-9])/, '$1 $2');
};

/**
 * Formats a date string.
 */
export const formatDate = (dateString: string, locale = 'es-ES'): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
};

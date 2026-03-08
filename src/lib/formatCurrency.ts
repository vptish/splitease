/**
 * Currency Formatter Utility
 * Formats numbers as currency strings with proper symbols and formatting
 */

type SupportedCurrency = 'ZAR' | 'USD' | 'EUR' | 'GBP';

interface CurrencyFormat {
  symbol: string;
  position: 'before' | 'after';
  separator: string;
  decimals: number;
}

const CURRENCY_FORMATS: Record<SupportedCurrency, CurrencyFormat> = {
  ZAR: {
    symbol: 'R',
    position: 'before',
    separator: ' ',
    decimals: 2,
  },
  USD: {
    symbol: '$',
    position: 'before',
    separator: '',
    decimals: 2,
  },
  EUR: {
    symbol: '€',
    position: 'after',
    separator: ' ',
    decimals: 2,
  },
  GBP: {
    symbol: '£',
    position: 'before',
    separator: '',
    decimals: 2,
  },
};

/**
 * Format a number as a currency string
 * @param amount - The amount to format
 * @param currency - The currency code (ZAR, USD, EUR, GBP). Defaults to ZAR
 * @returns Formatted currency string (e.g., "R 150.00", "$25.50")
 */
export const formatCurrency = (
  amount: number,
  currency: SupportedCurrency = 'ZAR'
): string => {
  const format = CURRENCY_FORMATS[currency] || CURRENCY_FORMATS.ZAR;

  // Format the number with proper decimal places
  const formattedNumber = Math.abs(amount).toFixed(format.decimals);

  // Handle negative values
  const sign = amount < 0 ? '-' : '';

  // Construct the currency string
  const currencyString =
    format.position === 'before'
      ? `${format.symbol}${format.separator}${formattedNumber}`
      : `${formattedNumber}${format.separator}${format.symbol}`;

  return `${sign}${currencyString}`;
};

/**
 * Format a number as a currency string with locale-specific formatting
 * @param amount - The amount to format
 * @param currency - The currency code
 * @param locale - Locale code (e.g., 'en-US', 'en-ZA'). Defaults to browser locale
 * @returns Formatted currency string
 */
export const formatCurrencyLocale = (
  amount: number,
  currency: SupportedCurrency = 'ZAR',
  locale?: string
): string => {
  const currentLocale = locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');

  try {
    return new Intl.NumberFormat(currentLocale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Fallback to simple formatter if locale not supported
    return formatCurrency(amount, currency);
  }
};

/**
 * Parse a currency string back to a number
 * @param currencyString - Formatted currency string (e.g., "R 150.00")
 * @returns The numeric value
 */
export const parseCurrency = (currencyString: string): number => {
  // Remove all non-numeric characters except decimal point and minus sign
  const cleaned = currencyString.replace(/[^\d.\-]/g, '');
  return parseFloat(cleaned) || 0;
};

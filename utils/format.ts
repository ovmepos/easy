
import { Language } from '../types';

/**
 * Formats numbers into localized strings.
 * Supports English and Arabic localized numerals.
 */
export const formatNumber = (
  num: number | string, 
  lang: Language, 
  options: Intl.NumberFormatOptions = {}
): string => {
  const value = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(value)) return '0';

  // locale detection logic
  let locale = 'en-US';
  if (lang === 'ar') locale = 'ar-SA-u-nu-arab'; // Arabic numerals
  
  const defaultOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
    ...options
  };

  return new Intl.NumberFormat(locale, defaultOptions).format(value);
};

/**
 * Specifically formats currency values using the app's CURRENCY constant.
 */
export const formatCurrency = (
  amount: number, 
  lang: Language, 
  currencySymbol: string
): string => {
  const formattedValue = formatNumber(amount, lang, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
  
  // In many Asian/Arabic locales, symbol position varies
  if (lang === 'ar') return `${formattedValue} ${currencySymbol}`;
  
  return `${currencySymbol}${formattedValue}`;
};

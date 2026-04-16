export type CurrencyCode = "LKR" | "USD" | "GBP" | "EUR" | "AED";

export type CurrencyRates = Record<CurrencyCode, number>;

export const currencyOptions: Array<{
  code: CurrencyCode;
  label: string;
  symbol: string;
}> = [
  { code: "LKR", label: "LKR (Rs)", symbol: "Rs" },
  { code: "USD", label: "USD ($)", symbol: "$" },
  { code: "GBP", label: "GBP (£)", symbol: "£" },
  { code: "EUR", label: "EUR (€)", symbol: "€" },
  { code: "AED", label: "AED (AED)", symbol: "AED" },
];

export const defaultCurrency: CurrencyCode = "LKR";

export const fallbackRates: CurrencyRates = {
  LKR: 1,
  USD: 0.0033,
  GBP: 0.0026,
  EUR: 0.0030,
  AED: 0.0121,
};

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return (
    value === "LKR" ||
    value === "USD" ||
    value === "GBP" ||
    value === "EUR" ||
    value === "AED"
  );
}

export function getCurrencySymbol(code: CurrencyCode) {
  return currencyOptions.find((c) => c.code === code)?.symbol ?? "Rs";
}

export function getCurrencyLabel(code: CurrencyCode) {
  return currencyOptions.find((c) => c.code === code)?.label ?? "LKR (Rs)";
}

export function convertFromLkr(
  amountLkr: number,
  currency: CurrencyCode,
  rates: CurrencyRates
) {
  const safeRate = rates[currency];
  if (!Number.isFinite(amountLkr)) return 0;
  if (currency === "LKR" || !Number.isFinite(safeRate) || safeRate <= 0) {
    return amountLkr;
  }
  return amountLkr * safeRate;
}

export function formatCurrencyNumber(
  amountLkr: number,
  currency: CurrencyCode,
  rates: CurrencyRates
) {
  const amount = convertFromLkr(amountLkr, currency, rates);
  const digits = currency === "LKR" ? 0 : 2;

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

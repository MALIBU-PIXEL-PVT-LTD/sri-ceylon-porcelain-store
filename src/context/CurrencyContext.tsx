"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  currencyOptions,
  defaultCurrency,
  fallbackRates,
  formatCurrencyNumber,
  isCurrencyCode,
  type CurrencyCode,
  type CurrencyRates,
} from "@/lib/currency";

const CURRENCY_STORAGE_KEY = "sri-ceylon-porcelain-currency-v1";
const RATES_STORAGE_KEY = "sri-ceylon-porcelain-rates-v1";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  rates: CurrencyRates;
  formatAmount: (amountLkr: number) => string;
  availableCurrencies: typeof currencyOptions;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function readStoredCurrency(): CurrencyCode {
  try {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    return isCurrencyCode(stored) ? stored : defaultCurrency;
  } catch {
    return defaultCurrency;
  }
}

function isCurrencyRates(value: unknown): value is CurrencyRates {
  if (value === null || typeof value !== "object") return false;
  const rates = value as Record<string, unknown>;
  return (
    typeof rates.LKR === "number" &&
    typeof rates.USD === "number" &&
    typeof rates.GBP === "number" &&
    typeof rates.EUR === "number" &&
    typeof rates.AED === "number"
  );
}

function readStoredRates(): CurrencyRates {
  try {
    const stored = localStorage.getItem(RATES_STORAGE_KEY);
    const parsed = stored ? (JSON.parse(stored) as unknown) : null;
    return isCurrencyRates(parsed) ? parsed : fallbackRates;
  } catch {
    return fallbackRates;
  }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>(defaultCurrency);
  const [rates, setRates] = useState<CurrencyRates>(fallbackRates);

  useEffect(() => {
    setCurrency(readStoredCurrency());
    setRates(readStoredRates());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
    } catch {
      /* ignore storage failures */
    }
  }, [currency]);

  useEffect(() => {
    let cancelled = false;

    async function loadRates() {
      try {
        const response = await fetch("/api/exchange-rates");
        if (!response.ok) return;
        const json = (await response.json()) as { rates?: unknown };
        if (!isCurrencyRates(json.rates) || cancelled) return;
        setRates(json.rates);
        try {
          localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(json.rates));
        } catch {
          /* ignore storage failures */
        }
      } catch {
        /* keep last known rates */
      }
    }

    void loadRates();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      rates,
      formatAmount: (amountLkr: number) =>
        formatCurrencyNumber(amountLkr, currency, rates),
      availableCurrencies: currencyOptions,
    }),
    [currency, rates]
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("must be used within a CurrencyProvider");
  }
  return ctx;
}

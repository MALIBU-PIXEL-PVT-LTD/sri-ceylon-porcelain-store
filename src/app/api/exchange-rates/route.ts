import { NextResponse } from "next/server";

import { fallbackRates, type CurrencyRates } from "@/lib/currency";

const API_KEY = "651bc76bad562f541dd7c77c";

export const revalidate = 21600;

export async function GET() {
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/LKR`,
      {
        next: { revalidate },
      }
    );

    if (!response.ok) {
      throw new Error(`Exchange rate request failed: ${response.status}`);
    }

    const json = (await response.json()) as {
      result?: string;
      conversion_rates?: Record<string, number>;
      time_last_update_utc?: string;
    };

    if (json.result !== "success" || !json.conversion_rates) {
      throw new Error("Exchange rate API did not return conversion rates");
    }

    const rates: CurrencyRates = {
      LKR: 1,
      USD: json.conversion_rates.USD ?? fallbackRates.USD,
      GBP: json.conversion_rates.GBP ?? fallbackRates.GBP,
      EUR: json.conversion_rates.EUR ?? fallbackRates.EUR,
      AED: json.conversion_rates.AED ?? fallbackRates.AED,
    };

    return NextResponse.json({
      rates,
      updatedAt: json.time_last_update_utc ?? null,
    });
  } catch {
    return NextResponse.json(
      { rates: fallbackRates, updatedAt: null },
      { status: 200 }
    );
  }
}

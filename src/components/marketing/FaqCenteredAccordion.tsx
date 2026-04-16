/**
 * Centered FAQ accordion — pattern inspired by
 * https://tailwindcss.com/plus/ui-blocks/marketing/sections/faq-sections
 * (“Centered accordion”; native `<details>` for a11y, original copy).
 */

import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I care for glazed porcelain?",
    answer:
      "Most daily use only needs warm water and a soft sponge. Avoid abrasive scrubbers and sudden temperature shocks (e.g. freezer to oven). Microwave and dishwasher use depends on the piece—check the product page for each item.",
  },
  {
    question: "Do you ship across Sri Lanka?",
    answer:
      "Yes. We pack each order with recyclable padding and ship via trusted couriers. Rural or remote areas may need an extra day or two; you will see an estimate at checkout once you enter your address.",
  },
  {
    question: "What is your return policy?",
    answer:
      "Unused items in original packaging may be returned within 14 days of delivery for a refund or exchange. If an item arrives damaged, contact us within 48 hours with photos and we will replace it or refund you.",
  },
  {
    question: "Can I order for a restaurant or hotel?",
    answer:
      "We work with hospitality teams on larger sets and repeat orders. Email us with your timeline and quantities; we will confirm lead times and any volume pricing before you pay.",
  },
  {
    question: "Are colours exactly as shown on screen?",
    answer:
      "We photograph in natural light and colour-correct carefully, but glaze can read slightly warmer or cooler depending on your display and room lighting. If you need a close match, order a single piece first or ask for swatch guidance.",
  },
] as const;

export function FaqCenteredAccordion() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="border-t border-stone-200/80 pt-16 sm:pt-20"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2
          id="faq-heading"
          className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-stone-500"
        >
          FAQ
        </h2>
        <p className="type-h4 mt-2 text-pretty text-stone-900">
          Questions we hear often
        </p>
        <p className="type-p mt-3 text-pretty text-stone-600">
          Everything below applies to orders placed on this store. For bespoke or trade
          projects, we will confirm details in writing.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-2xl border-y border-stone-200/90">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="border-b border-stone-200/90 py-1 last:border-b-0 [&[open]_summary_svg]:rotate-180"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-sm font-medium text-stone-900 transition-colors hover:text-stone-600 sm:text-base [&::-webkit-details-marker]:hidden">
              <span className="pr-2">{faq.question}</span>
              <ChevronDown
                className="h-5 w-5 shrink-0 text-stone-500 transition-transform duration-200 ease-out"
                aria-hidden
              />
            </summary>
            <div className="pb-4 pr-10 text-sm leading-relaxed text-stone-600 sm:pr-12 sm:text-[0.9375rem]">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

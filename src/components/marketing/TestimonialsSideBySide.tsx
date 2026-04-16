/**
 * Testimonials — horizontal scroll-snap carousel (touch, trackpad, buttons, arrows).
 * Visual rhythm inspired by Tailwind Plus marketing testimonials patterns.
 */

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useRef } from "react";
import { IconButton } from "@/components/ui";

const testimonials = [
  {
    quote:
      "We replaced a full table five years of daily service. The glaze still reads calm under candlelight—our guests comment on it more than the wine list.",
    author: "Amaya Perera",
    role: "Owner, Wild Coast Table",
    initials: "AP",
  },
  {
    quote:
      "Sourcing for a boutique hotel means every piece has to survive brunch, room service, and scrutiny from designers. This line has held its line and its color.",
    author: "James Okonkwo",
    role: "Procurement, Harbour & Stone",
    initials: "JO",
  },
  {
    quote:
      "The weight in the hand is what sold our café on the switch. Porcelain that feels considered keeps people at the table a little longer—and coming back.",
    author: "Nethmi Ranasinghe",
    role: "Founder, Temple Tree Kitchen",
    initials: "NR",
  },
] as const;

export function TestimonialsSideBySide() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBySlide = useCallback((direction: -1 | 1) => {
    const root = scrollerRef.current;
    if (!root) return;
    const first = root.firstElementChild as HTMLElement | null;
    if (!first) return;
    const gap = parseFloat(getComputedStyle(root).gap) || 24;
    const delta = first.offsetWidth + gap;
    root.scrollBy({ left: direction * delta, behavior: "smooth" });
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollBySlide(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollBySlide(1);
      }
    },
    [scrollBySlide],
  );

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="border-t border-stone-200/80 pt-16 sm:pt-20"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="testimonials-heading"
            className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-stone-500"
          >
            Testimonials
          </h2>
          <p className="type-h4 mt-2 max-w-xl text-stone-900">
            What people say at the table
          </p>
        </div>
        <div className="flex shrink-0 gap-2 sm:justify-end">
          <IconButton
            icon={<ChevronLeft className="h-5 w-5" aria-hidden />}
            className="border border-stone-200/90 bg-white/80 text-stone-700 shadow-sm hover:border-stone-300 hover:bg-white hover:text-stone-900 active:bg-stone-100"
            aria-controls="testimonials-carousel"
            aria-label="Previous testimonial"
            onClick={() => scrollBySlide(-1)}
          />
          <IconButton
            icon={<ChevronRight className="h-5 w-5" aria-hidden />}
            className="border border-stone-200/90 bg-white/80 text-stone-700 shadow-sm hover:border-stone-300 hover:bg-white hover:text-stone-900 active:bg-stone-100"
            aria-controls="testimonials-carousel"
            aria-label="Next testimonial"
            onClick={() => scrollBySlide(1)}
          />
        </div>
      </div>

      <div className="-mx-4 mt-10 sm:-mx-6 lg:-mx-8">
        <div
          ref={scrollerRef}
          id="testimonials-carousel"
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
          onKeyDown={onKeyDown}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain scroll-smooth px-4 pb-2 [-ms-overflow-style:none] [scrollbar-color:theme(colors.stone.300)_transparent] [scrollbar-width:thin] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400 sm:gap-8 sm:px-6 lg:px-8 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-stone-300/90 [&::-webkit-scrollbar-track]:bg-transparent"
        >
          {testimonials.map((t, index) => (
            <figure
              key={t.author}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${testimonials.length}`}
              className="w-[min(88vw,28rem)] shrink-0 snap-start snap-always rounded-sm border border-stone-200/90 bg-white/50 p-6 sm:w-[min(80vw,28rem)] sm:p-8 md:w-[28rem]"
            >
              <blockquote className="type-p relative text-pretty text-stone-700">
                <span
                  className="absolute -left-1 -top-2 select-none font-serif text-5xl leading-none text-stone-200 sm:-left-2 sm:-top-3 sm:text-6xl"
                  aria-hidden
                >
                  “
                </span>
                <p className="relative pl-5 sm:pl-7">{t.quote}</p>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4 border-t border-stone-200/90 pt-8">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-stone-200/90 bg-stone-100 text-xs font-semibold tracking-tight text-stone-600"
                  aria-hidden
                >
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-medium text-stone-900">{t.author}</p>
                  <p className="mt-0.5 text-sm text-stone-500">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

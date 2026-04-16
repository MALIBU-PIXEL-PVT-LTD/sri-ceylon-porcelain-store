/**
 * Logo cloud / “Our clients” — layout and rhythm inspired by
 * https://tailwindcss.com/plus/ui-blocks/marketing/sections/logo-clouds
 * (Tailwind Plus marketing patterns; implemented without proprietary kit code).
 */

const clients = [
  "Colombo House",
  "Harbour & Stone",
  "Temple Tree Kitchen",
  "Wild Coast Table",
  "Oya Dining",
  "Linen & Ember",
] as const;

export function OurClients() {
  return (
    <section aria-labelledby="clients-heading" className="border-t border-stone-200/80 pt-16 sm:pt-20">
      <div className="rounded-sm border border-stone-200/90 bg-stone-50/60 px-6 py-10 sm:px-10 sm:py-12">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-none">
          <h2
            id="clients-heading"
            className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-stone-500"
          >
            Our clients
          </h2>
          <p className="type-h4 mt-3 text-pretty text-stone-900">
            Trusted by tables that care about craft
          </p>
          <p className="type-p mt-3 text-pretty text-stone-600">
            Hotels, independent restaurants, and designers who choose porcelain
            for the long run—not the photo op.
          </p>
        </div>

        <ul
          className="mx-auto mt-10 grid max-w-lg grid-cols-2 items-center justify-items-center gap-x-6 gap-y-10 sm:max-w-2xl sm:grid-cols-3 sm:gap-x-10 lg:mx-0 lg:mt-12 lg:max-w-none lg:grid-cols-6"
          role="list"
        >
          {clients.map((name) => (
            <li key={name} className="flex w-full max-w-[11rem] justify-center lg:max-w-none">
              <span className="block text-center text-base font-semibold tracking-tight text-stone-500 transition-colors duration-300 hover:text-stone-800">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

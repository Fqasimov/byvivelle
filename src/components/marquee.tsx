"use client";

import { useT } from "@/lib/i18n";

/**
 * The tagline band. Two identical tracks sit side by side and the pair is
 * translated by exactly -50%, so the loop closes on itself with no seam and no
 * JavaScript running per frame.
 */
export function Marquee() {
  const t = useT();
  const items = [...t.marquee, ...t.marquee, ...t.marquee];

  return (
    <div className="relative overflow-hidden border-y border-line bg-ink py-3.5 text-paper">
      <div
        className="flex w-max animate-[bv-marquee_46s_linear_infinite] motion-reduce:animate-none"
        aria-hidden
      >
        {[0, 1].map((track) => (
          <ul key={track} className="flex shrink-0 items-center">
            {items.map((item, i) => (
              <li key={`${track}-${i}`} className="flex items-center">
                <span className="px-6 font-sans text-[0.6875rem] font-medium tracking-[0.22em] whitespace-nowrap uppercase">
                  {item}
                </span>
                <span className="text-copper-light/70" aria-hidden>
                  ✦
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>

      {/* Screen readers get the tagline once, not thirty-six times. */}
      <p className="sr-only">{t.marquee.join(" · ")}</p>

      {/* Fade the band into the page edges rather than cutting it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-ink to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-ink to-transparent"
      />
    </div>
  );
}

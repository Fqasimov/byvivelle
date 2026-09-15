"use client";

import { useT } from "@/lib/i18n";
import { Stagger, StaggerItem } from "./ui/reveal";
import { Section, SectionHeading } from "./ui/section";

/**
 * Line icons drawn to match the brand collateral: single-weight strokes, round
 * caps, no fills. They sit on `currentColor` so the hover state is one rule.
 */
const ICONS = [
  // cake
  <>
    <path d="M3 20h18M5 20v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6" />
    <path d="M12 12V8M9 12V9M15 12V9" />
    <path d="M12 6.5c.7-.6.7-1.4 0-2.5-.7 1.1-.7 1.9 0 2.5Z" />
    <path d="M9 7.5c.6-.5.6-1.2 0-2-.6.8-.6 1.5 0 2ZM15 7.5c.6-.5.6-1.2 0-2-.6.8-.6 1.5 0 2Z" />
  </>,
  // heart
  <path d="M12 20s-7-4.4-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7 2.8C19 15.6 12 20 12 20Z" />,
  // rings
  <>
    <circle cx="9.5" cy="14" r="5" />
    <circle cx="15" cy="12" r="5" />
    <path d="M13.2 5.6 15 3l1.8 2.6" />
  </>,
  // plane
  <>
    <path d="M3.5 13.2 21 5l-6.2 15.2-2.6-6.4-6.4-2.6Z" />
    <path d="m12.2 13.8 3.4-3.4" />
  </>,
];

export function Occasions() {
  const t = useT();

  return (
    <Section id="occasions" className="bg-paper-warm">
      <div className="container-page">
        <SectionHeading
          eyebrow={t.occasions.eyebrow}
          title={t.occasions.title}
          align="center"
        />

        <Stagger stagger={0.08} delay={0.1} className="mt-16 grid gap-px overflow-hidden rounded-[1.25rem] bg-line-strong sm:grid-cols-2 lg:grid-cols-4">
          {t.occasions.items.map((item, i) => (
            <StaggerItem
              key={item.title}
              className="group relative bg-paper-warm p-8 transition-colors duration-500 ease-[var(--ease-out-quart)] hover:bg-paper sm:p-9"
            >
              <span className="grid size-12 place-items-center rounded-full bg-ink/[0.045] text-ink-soft transition-[background-color,color,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:bg-copper/15 group-hover:text-copper-deep">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {ICONS[i]}
                </svg>
              </span>

              <h3 className="mt-7 text-[1.25rem] leading-snug">{item.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                {item.body}
              </p>

              {/* Hairline that grows in from the left on hover. */}
              <span
                aria-hidden
                className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-copper transition-transform duration-[600ms] ease-[var(--ease-out-expo)] group-hover:scale-x-100"
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}

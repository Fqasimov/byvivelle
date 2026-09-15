"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useT } from "@/lib/i18n";
import { EASE } from "@/lib/motion";
import { Stagger, StaggerItem } from "./ui/reveal";
import { Section, SectionHeading } from "./ui/section";
import { cn } from "@/lib/utils";

export function Faq() {
  const t = useT();
  // Single-open accordion: two answers at once is two answers unread.
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} />
            </div>
          </div>

          <Stagger stagger={0.06} className="lg:col-span-7 lg:col-start-6">
            <ul className="border-t border-line">
              {t.faq.items.map((item, i) => {
                const expanded = open === i;

                return (
                  <StaggerItem key={item.q} as="li" className="border-b border-line">
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(expanded ? null : i)}
                        aria-expanded={expanded}
                        aria-controls={`faq-panel-${i}`}
                        id={`faq-trigger-${i}`}
                        className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                      >
                        <span
                          className={cn(
                            "font-display text-[1.125rem] leading-snug transition-colors duration-300 sm:text-[1.25rem]",
                            expanded ? "text-ink" : "text-ink-soft group-hover:text-ink",
                          )}
                        >
                          {item.q}
                        </span>

                        {/* Plus that rotates into a minus — one bar turns. */}
                        <span
                          aria-hidden
                          className="relative mt-1 grid size-6 shrink-0 place-items-center"
                        >
                          <span className="absolute h-px w-3.5 bg-ink-muted transition-colors duration-300 group-hover:bg-ink" />
                          <span
                            className={cn(
                              "absolute h-3.5 w-px bg-ink-muted transition-[transform,opacity,background-color] duration-[450ms] ease-[var(--ease-out-expo)] group-hover:bg-ink",
                              expanded && "rotate-90 opacity-0",
                            )}
                          />
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {expanded ? (
                        <motion.div
                          key="panel"
                          id={`faq-panel-${i}`}
                          role="region"
                          aria-labelledby={`faq-trigger-${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            height: { duration: 0.42, ease: EASE.outExpo },
                            opacity: { duration: 0.25, ease: EASE.outQuart },
                          }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-[58ch] pr-10 pb-7 leading-[1.75] text-ink-muted">
                            {item.a}
                          </p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </StaggerItem>
                );
              })}
            </ul>
          </Stagger>
        </div>
      </div>
    </Section>
  );
}

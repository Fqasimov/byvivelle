"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useT } from "@/lib/i18n";
import { EASE } from "@/lib/motion";
import { Reveal } from "./ui/reveal";
import { Section } from "./ui/section";

export function Process() {
  const t = useT();
  const listRef = useRef<HTMLOListElement>(null);

  // The rule beside the steps fills as the list passes through the viewport.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 75%", "end 65%"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });
  const scaleY = useTransform(fill, [0, 1], [0, 1]);

  return (
    <Section id="process">
      <div className="container-page">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-14">
          {/* — sticky side ————————————————————————— */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal className="flex items-center gap-3">
                <span aria-hidden className="h-px w-8 bg-copper/45" />
                <span className="eyebrow">{t.process.eyebrow}</span>
              </Reveal>

              <Reveal delay={0.05}>
                <h2 className="mt-5 max-w-[14ch] text-4xl leading-[1.08] sm:text-5xl">
                  {t.process.title}
                </h2>
              </Reveal>

              <Reveal delay={0.1}>
                <figure className="mt-10 hidden overflow-hidden rounded-[1.5rem] shadow-raise ring-1 ring-ink/[0.06] lg:block">
                  <Image
                    src="/media/process-book.jpg"
                    alt=""
                    width={511}
                    height={451}
                    sizes="38vw"
                    className="h-auto w-full"
                  />
                </figure>
              </Reveal>
            </div>
          </div>

          {/* — steps ——————————————————————————————— */}
          <ol ref={listRef} className="relative lg:col-span-6 lg:col-start-7">
            {/* Track + fill, drawn once for the whole list. */}
            <span
              aria-hidden
              className="absolute top-2 bottom-2 left-0 w-px bg-line"
            />
            <motion.span
              aria-hidden
              style={{ scaleY }}
              className="absolute top-2 bottom-2 left-0 w-px origin-top bg-copper"
            />

            {t.process.steps.map((step, i) => (
              <motion.li
                key={step.n}
                initial={{ opacity: 0, x: 18, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, ease: EASE.outExpo }}
                className="relative pb-14 pl-10 last:pb-0 sm:pl-14"
              >
                {/* Node on the rule. */}
                <motion.span
                  aria-hidden
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, ease: EASE.outExpo, delay: 0.1 }}
                  className="absolute top-2 -left-[3.5px] size-2 rounded-full bg-copper ring-4 ring-paper"
                />

                <span className="block font-sans text-[0.6875rem] font-medium tracking-[0.18em] text-copper-deep">
                  {step.n}
                </span>

                <h3 className="mt-3 text-[1.5rem] leading-snug sm:text-[1.75rem]">
                  {step.title}
                </h3>

                <p className="mt-3 max-w-[46ch] leading-[1.75] text-ink-muted">
                  {step.body}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}

"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useT } from "@/lib/i18n";
import { VIEWPORT } from "@/lib/motion";
import { Reveal, Stagger, StaggerItem } from "./ui/reveal";
import { Section } from "./ui/section";

export function About() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // A slow counter-drift inside the frame. The image is scaled past its box so
  // the movement never exposes an edge.
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <Section id="about" className="bg-paper-warm">
      <div ref={ref} className="container-page">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          {/* — photograph ————————————————————————— */}
          <Reveal className="lg:col-span-5">
            <figure className="relative">
              <div className="relative aspect-4/5 overflow-hidden rounded-[1.5rem] shadow-raise ring-1 ring-ink/[0.06]">
                <motion.div
                  style={reduced ? undefined : { y: imageY }}
                  className="absolute inset-x-0 -inset-y-[8%]"
                >
                  <Image
                    src="/media/archive-cover.jpg"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 90vw, 38vw"
                    className="object-cover"
                  />
                </motion.div>
              </div>

              {/* Foil mark, echoing the stamped monogram on the envelopes. */}
              <div className="absolute -top-5 -right-5 hidden size-20 place-items-center rounded-full bg-paper shadow-lift ring-1 ring-ink/[0.06] sm:grid">
                <Image
                  src="/media/logo.png"
                  alt=""
                  width={120}
                  height={120}
                  sizes="80px"
                  className="size-[4.25rem] rounded-full"
                />
              </div>
            </figure>
          </Reveal>

          {/* — copy ——————————————————————————————— */}
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal className="flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-copper/45" />
              <span className="eyebrow">{t.about.eyebrow}</span>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="mt-5 max-w-[15ch] text-4xl leading-[1.08] sm:text-5xl">
                {t.about.title}
              </h2>
            </Reveal>

            <Stagger delay={0.1} className="mt-7 space-y-5">
              {t.about.body.map((paragraph) => (
                <StaggerItem key={paragraph}>
                  <p className="max-w-[52ch] leading-[1.75] text-ink-soft">
                    {paragraph}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>

            {/* — figures ————————————————————————— */}
            <motion.dl
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-8"
            >
              {t.about.stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.12 + i * 0.08, duration: 0.6 },
                    },
                  }}
                >
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-display text-[2rem] leading-none text-ink sm:text-[2.5rem]">
                      {stat.value}
                    </span>
                    <span className="mt-2 block font-sans text-[0.75rem] leading-snug text-ink-muted">
                      {stat.label}
                    </span>
                  </dd>
                </motion.div>
              ))}
            </motion.dl>
          </div>
        </div>
      </div>
    </Section>
  );
}

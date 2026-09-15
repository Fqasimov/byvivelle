"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useT } from "@/lib/i18n";
import { EASE } from "@/lib/motion";
import { Button } from "./ui/button";

export function Hero() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The photograph drifts a little slower than the page, and dims as it goes.
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.4]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const lines = [t.hero.titleTop, t.hero.titleBottom];

  return (
    <div id="top" ref={ref} className="relative overflow-clip">
      {/* Warm light falling from the top-left, the way it does in the brand
          photography. Cheap radial gradients, no image. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60rem 40rem at 12% -10%, rgb(255 252 247) 0%, transparent 62%), radial-gradient(48rem 34rem at 92% 8%, rgb(232 214 195 / 0.55) 0%, transparent 60%)",
        }}
      />

      <div className="container-page pt-32 pb-20 sm:pt-40 lg:pt-44 lg:pb-32">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          {/* ——— copy ——————————————————————————————— */}
          <motion.div
            style={reduced ? undefined : { y: textY }}
            className="lg:col-span-6 xl:col-span-5"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE.outExpo, delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <span aria-hidden className="h-px w-8 bg-copper/50" />
              <span className="eyebrow">{t.hero.eyebrow}</span>
            </motion.div>

            <h1 className="mt-7 text-[clamp(2.75rem,7.5vw,5.25rem)] leading-[0.98] tracking-[-0.025em]">
              {lines.map((line, i) => (
                // Each line is masked by its own overflow box, so the blur
                // reveal rises out of nothing instead of fading in place.
                <span key={line} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    initial={{ opacity: 0, y: "0.5em", filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
                    transition={{
                      duration: 0.95,
                      ease: EASE.outExpo,
                      delay: 0.28 + i * 0.09,
                    }}
                    className="block"
                  >
                    {i === 1 ? (
                      <em className="font-serif italic">{line}</em>
                    ) : (
                      line
                    )}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: EASE.outExpo, delay: 0.52 }}
              className="mt-7 max-w-[44ch] text-[1.0625rem] leading-[1.65] text-ink-soft"
            >
              {t.hero.lead}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE.outExpo, delay: 0.64 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <Button href="#collections">{t.hero.ctaPrimary}</Button>
              <Button href="#process" variant="outline">
                {t.hero.ctaSecondary}
              </Button>
            </motion.div>
          </motion.div>

          {/* ——— photograph ————————————————————————— */}
          <motion.div
            style={reduced ? undefined : { y: imageY, opacity: imageOpacity }}
            className="relative lg:col-span-6 lg:col-start-7 xl:col-span-6 xl:col-start-7"
          >
            <motion.figure
              initial={{ opacity: 0, scale: 1.04, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.3, ease: EASE.outExpo, delay: 0.18 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-[1.75rem] shadow-float ring-1 ring-ink/[0.06]">
                <Image
                  src="/media/wedding-cover.jpg"
                  alt={t.hero.caption}
                  width={1400}
                  height={1401}
                  priority
                  sizes="(max-width: 1024px) 92vw, 46vw"
                  className="h-auto w-full"
                />
              </div>

              {/* A detail lifted from the same photograph, framed as a circle —
                  the motif the collections section is built on. */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: EASE.outExpo, delay: 0.95 }}
                className="absolute -bottom-6 -left-6 hidden size-28 overflow-hidden rounded-full shadow-raise ring-4 ring-paper sm:block lg:-left-10 lg:size-32"
              >
                <Image
                  src="/media/wedding-rings.jpg"
                  alt=""
                  width={281}
                  height={281}
                  sizes="128px"
                  className="size-full object-cover"
                />
              </motion.div>

              {/* Cleared past the circular inset that overlaps this corner. */}
              <figcaption className="mt-5 flex items-center gap-3 pl-1 sm:pl-28 lg:pl-28">
                <span aria-hidden className="h-px w-6 bg-line-strong" />
                <span className="font-sans text-[0.75rem] tracking-[0.04em] text-ink-faint">
                  {t.hero.caption}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        </div>
      </div>

      {/* ——— scroll cue ————————————————————————————— */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        style={reduced ? undefined : { opacity: cueOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center lg:flex"
      >
        <span className="flex flex-col items-center gap-2">
          <span className="eyebrow text-[0.625rem]">{t.hero.scroll}</span>
          <span aria-hidden className="relative block h-9 w-px overflow-hidden bg-line-strong">
            <motion.span
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
              className="absolute inset-x-0 h-4 bg-copper"
            />
          </span>
        </span>
      </motion.div>
    </div>
  );
}

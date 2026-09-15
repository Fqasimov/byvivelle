"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "./ui/reveal";
import { Section } from "./ui/section";
import { Button } from "./ui/button";

export function Order() {
  const t = useT();

  return (
    <Section id="order" className="relative overflow-hidden bg-ink text-paper">
      {/* Warm pool of light, so a full-bleed dark band still feels like paper
          under a lamp rather than a UI panel. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(44rem 30rem at 82% 12%, rgb(185 132 96 / 0.22) 0%, transparent 62%), radial-gradient(38rem 26rem at 8% 96%, rgb(216 178 149 / 0.12) 0%, transparent 60%)",
        }}
      />

      <div className="container-page relative">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal className="flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-copper-light/60" />
              <span className="eyebrow text-copper-light">{t.order.eyebrow}</span>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="mt-5 text-[clamp(2.5rem,6vw,4rem)] leading-[1.02] text-paper">
                {t.order.title}
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[48ch] text-[1.0625rem] leading-[1.7] text-paper/65">
                {t.order.lead}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Button
                  href={INSTAGRAM_URL}
                  external
                  className="bg-paper text-ink hover:bg-paper/90"
                >
                  {t.order.cta}
                </Button>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-2 px-2 font-sans text-sm text-paper/60 transition-colors hover:text-paper"
                >
                  {INSTAGRAM_HANDLE}
                  <span
                    aria-hidden
                    className="transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-6 font-serif text-sm italic text-paper/40">
                {t.order.note}
              </p>
            </Reveal>

            {/* — facts ————————————————————————————— */}
            <Stagger
              stagger={0.08}
              delay={0.1}
              className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-paper/12 sm:grid-cols-3"
            >
              {t.order.facts.map((fact) => (
                <StaggerItem key={fact.label} className="bg-ink px-6 py-6">
                  <p className="font-sans text-[0.6875rem] tracking-[0.14em] uppercase text-paper/45">
                    {fact.label}
                  </p>
                  <p className="mt-2.5 font-display text-[1.375rem] text-paper">
                    {fact.value}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* — product ————————————————————————————— */}
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <figure className="relative mx-auto max-w-sm">
              <div className="overflow-hidden rounded-full shadow-float ring-1 ring-paper/10">
                <Image
                  src="/media/keepsake-box.jpg"
                  alt=""
                  width={442}
                  height={424}
                  sizes="(max-width: 1024px) 70vw, 28vw"
                  className="aspect-square w-full object-cover"
                />
              </div>

              {/* Slowly turning rule, echoing the seal on the packaging. */}
              <span
                aria-hidden
                className="absolute -inset-4 rounded-full border border-dashed border-paper/15"
              />
            </figure>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";
import { Stagger, StaggerItem } from "./ui/reveal";
import { Section, SectionHeading } from "./ui/section";

const SHOTS = [
  { src: "/media/craft-leather.jpg", width: 293, height: 328 },
  { src: "/media/keepsake-seal.jpg", width: 363, height: 350 },
  { src: "/media/archive-pages.jpg", width: 445, height: 421 },
];

export function Craft() {
  const t = useT();

  return (
    <Section id="craft">
      <div className="container-page">
        <SectionHeading eyebrow={t.craft.eyebrow} title={t.craft.title} />

        <Stagger stagger={0.1} delay={0.08} className="mt-16 grid gap-10 sm:gap-12 lg:grid-cols-3">
          {t.craft.items.map((item, i) => (
            <StaggerItem key={item.title} className="group">
              <figure className="relative overflow-hidden rounded-[1.25rem] bg-paper-deep shadow-lift ring-1 ring-ink/[0.06]">
                <div className="aspect-4/3 overflow-hidden">
                  <Image
                    src={SHOTS[i].src}
                    alt=""
                    width={SHOTS[i].width}
                    height={SHOTS[i].height}
                    sizes="(max-width: 1024px) 90vw, 30vw"
                    className="size-full scale-[1.02] object-cover transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover:scale-110 motion-reduce:transition-none"
                  />
                </div>
              </figure>

              <div className="mt-6 flex gap-5">
                <span
                  aria-hidden
                  className="mt-1 font-sans text-[0.6875rem] font-medium tracking-[0.18em] text-copper-deep"
                >
                  0{i + 1}
                </span>
                <div>
                  <h3 className="text-[1.3125rem] leading-snug">{item.title}</h3>
                  <p className="mt-2.5 max-w-[42ch] leading-relaxed text-ink-muted">
                    {item.body}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}

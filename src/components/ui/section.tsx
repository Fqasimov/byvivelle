"use client";

import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        centered && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Reveal className="flex items-center gap-3">
          <span
            aria-hidden
            className="h-px w-8 bg-copper/45"
          />
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
      ) : null}

      <Reveal delay={0.04}>
        <h2
          className={cn(
            "max-w-[18ch] text-4xl leading-[1.08] sm:text-5xl lg:text-[3.4rem]",
            centered && "mx-auto max-w-[22ch]",
          )}
        >
          {title}
        </h2>
      </Reveal>

      {lead ? (
        <Reveal delay={0.08}>
          <p
            className={cn(
              "max-w-[46ch] text-[0.975rem] leading-relaxed text-ink-muted",
              centered && "mx-auto",
            )}
          >
            {lead}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("py-24 sm:py-32 lg:py-(--spacing-section)", className)}
    >
      {children}
    </section>
  );
}

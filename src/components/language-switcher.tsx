"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { LANGUAGES, useLanguage } from "@/lib/i18n";
import { TRANSITION } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Segmented control. The active pill is a single shared element that slides
 * between options via `layoutId`, so switching language reads as one object
 * moving rather than two opacity changes.
 */
export function LanguageSwitcher({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const { lang, setLang, t } = useLanguage();
  // This control is rendered more than once (nav, mobile menu, footer). A
  // shared layoutId would make Motion treat every copy as the same element and
  // fly the pill between them, landing it in the wrong slot.
  const instanceId = useId();

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className={cn(
        "relative inline-flex items-center rounded-full p-[3px]",
        tone === "light"
          ? "bg-ink/[0.045] ring-1 ring-ink/5"
          : "bg-paper/10 ring-1 ring-paper/15",
        className,
      )}
    >
      {LANGUAGES.map((option) => {
        const active = option.code === lang;

        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLang(option.code)}
            aria-pressed={active}
            aria-label={option.name}
            className={cn(
              "relative rounded-full px-2.5 py-1 font-sans text-[0.6875rem] font-medium tracking-[0.1em] transition-colors duration-200",
              tone === "light"
                ? active
                  ? "text-paper"
                  : "text-ink-muted hover:text-ink"
                : active
                  ? "text-ink"
                  : "text-paper/60 hover:text-paper",
            )}
          >
            {active ? (
              <motion.span
                layoutId={`lang-pill-${instanceId}`}
                transition={TRANSITION.quick}
                className={cn(
                  "absolute inset-0 rounded-full",
                  tone === "light" ? "bg-ink" : "bg-paper",
                )}
              />
            ) : null}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

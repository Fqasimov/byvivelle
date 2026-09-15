"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "quiet";
type Size = "sm" | "md";

const BASE =
  "group/btn relative inline-flex select-none items-center justify-center overflow-hidden rounded-full font-sans font-medium tracking-[0.06em] uppercase transition-[transform,background-color,border-color,color] duration-200 ease-[var(--ease-out-quart)] active:scale-[0.985]";

const VARIANTS: Record<Variant, string> = {
  solid:
    "bg-ink text-paper hover:bg-ink-soft shadow-[0_1px_2px_rgb(60_40_24/0.18)]",
  outline:
    "border border-line-strong text-ink hover:border-ink/45 hover:bg-ink/[0.03]",
  quiet: "text-ink-muted hover:text-ink",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.6875rem]",
  md: "h-12 px-7 text-[0.75rem]",
};

/**
 * The label rolls: the resting text lifts away while a copy rises into its
 * place. Both copies are laid out in the same grid cell so the button never
 * changes width, and the whole thing is two transforms — cheap enough to stay
 * smooth on a phone.
 */
function RollingLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative grid overflow-hidden [grid-template-areas:'label']">
      <span
        className="[grid-area:label] transition-transform duration-[380ms] ease-[var(--ease-out-expo)] group-hover/btn:-translate-y-[130%] motion-reduce:transition-none motion-reduce:group-hover/btn:translate-y-0"
      >
        {children}
      </span>
      <span
        aria-hidden
        className="[grid-area:label] translate-y-[130%] transition-transform duration-[380ms] ease-[var(--ease-out-expo)] group-hover/btn:translate-y-0 motion-reduce:hidden"
      >
        {children}
      </span>
    </span>
  );
}

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  href,
  external,
  variant = "solid",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps &
  ({ href: string; external?: boolean } | { href?: undefined; external?: never }) &
  React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);
  const label = <RollingLabel>{children}</RollingLabel>;

  if (href) {
    return external ? (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={classes}
      >
        {label}
      </a>
    ) : (
      <Link href={href} className={classes}>
        {label}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {label}
    </button>
  );
}

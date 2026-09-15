import type { Options, Transition } from "motion-v";

/**
 * motion-v re-exports framer-motion's `Variants`, but the `variants` prop on
 * its own `<Motion>` component is typed slightly more narrowly. Deriving the
 * type from the component's options is what keeps these assignable.
 */
type Variants = NonNullable<Options["variants"]>;

/* ============================================================
   One motion vocabulary for the whole site.

   Rules of thumb used here:
   · nothing travels further than ~16px — distance reads as cheap
   · nothing eases linearly, and nothing bounces without a reason
   · entrances are fast (0.2–0.6s); only the album morph is allowed
     to take its time, because it is the one thing you are watching
   ============================================================ */

export const EASE = {
  /** Default. Decisive start, long soft landing. */
  outExpo: [0.16, 1, 0.3, 1],
  /** Interface feedback — hovers, toggles. */
  outQuart: [0.25, 1, 0.5, 1],
  /** Symmetrical, for things that leave the way they arrived. */
  inOutQuart: [0.76, 0, 0.24, 1],
} as const;

export const TRANSITION = {
  /** Section and text entrances. */
  soft: { duration: 0.6, ease: EASE.outExpo },
  /** Buttons, chips, small state changes. */
  quick: { duration: 0.22, ease: EASE.outQuart },
  /** Backdrops and fades. */
  fade: { duration: 0.32, ease: EASE.outQuart },
} satisfies Record<string, Transition>;

/**
 * The circle→album morph. A spring, not a duration, so the card keeps
 * its momentum through the shape change instead of arriving twice.
 */
export const MORPH: Transition = {
  type: "spring",
  stiffness: 240,
  damping: 30,
  mass: 0.85,
};

/**
 * Signature entrance: a short rise out of a soft blur.
 * Blur is what stops this reading as a generic fade-up.
 */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: TRANSITION.soft,
  },
};

/** Parent for staggered groups — children use `revealVariants`. */
export function staggerVariants(stagger = 0.07, delay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
}

/** Shared viewport config so sections don't each pick their own threshold. */
export const VIEWPORT = { once: true, amount: 0.25 } as const;

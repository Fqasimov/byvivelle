<script setup lang="ts">
import { cn } from "~/lib/utils";

type Variant = "solid" | "outline" | "quiet" | "inverse";
type Size = "sm" | "md";

const props = withDefaults(
  defineProps<{
    href?: string;
    external?: boolean;
    variant?: Variant;
    size?: Size;
  }>(),
  { variant: "solid", size: "md" },
);

const BASE =
  "group/btn relative inline-flex select-none items-center justify-center overflow-hidden rounded-full font-sans font-medium tracking-[0.06em] uppercase transition-[transform,background-color,border-color,color] duration-200 ease-[var(--ease-out-quart)] active:scale-[0.985]";

const VARIANTS: Record<Variant, string> = {
  solid: "bg-ink text-paper hover:bg-ink-soft shadow-[0_1px_2px_rgb(60_40_24/0.18)]",
  // For the dark bands: paper ground, deep-gold label.
  inverse: "bg-paper text-copper-ink hover:bg-white shadow-[0_1px_2px_rgb(0_0_0/0.25)]",
  outline: "border border-line-strong text-ink hover:border-ink/45 hover:bg-ink/[0.03]",
  quiet: "text-ink-muted hover:text-ink",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.6875rem]",
  md: "h-12 px-7 text-[0.75rem]",
};

// Vue merges a parent's `class` onto the root element without consulting
// tailwind-merge, so an override would sit *alongside* the variant's own
// colour and the CSS source order — not the caller — would decide which wins.
// That is how this button ended up white-on-white. Merging through cn()
// ourselves restores last-one-wins.
defineOptions({ inheritAttrs: false });
const attrs = useAttrs();

const classes = computed(() =>
  cn(BASE, VARIANTS[props.variant], SIZES[props.size], attrs.class as string),
);

/** Everything except `class`, which is folded into `classes` above. */
const passThrough = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});

const tag = computed(() => (props.href ? "a" : "button"));
</script>

<template>
  <component
    :is="tag"
    v-bind="passThrough"
    :href="props.href"
    :target="props.external ? '_blank' : undefined"
    :rel="props.external ? 'noreferrer noopener' : undefined"
    :class="classes"
  >
    <!-- The label rolls: the resting text lifts away while a copy rises into
         its place. Both copies share one grid cell so the button never changes
         width, and the whole thing is two transforms — cheap on a phone. -->
    <span class="relative grid overflow-hidden [grid-template-areas:'label']">
      <span
        class="[grid-area:label] transition-transform duration-[380ms] ease-[var(--ease-out-expo)] group-hover/btn:-translate-y-[130%] motion-reduce:transition-none motion-reduce:group-hover/btn:translate-y-0"
      >
        <slot />
      </span>
      <span
        aria-hidden="true"
        class="[grid-area:label] translate-y-[130%] transition-transform duration-[380ms] ease-[var(--ease-out-expo)] group-hover/btn:translate-y-0 motion-reduce:hidden"
      >
        <slot />
      </span>
    </span>
  </component>
</template>

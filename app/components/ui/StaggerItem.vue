<script setup lang="ts">
import { revealVariants } from "~/lib/motion";

/**
 * `li` exists so a staggered group inside a <ul> emits <li> elements — a <div>
 * child of a list is invalid markup and screen readers do notice.
 *
 * The two branches are spelled out rather than passing `as` through a variable:
 * <Motion> is generic over its tag, and a non-literal `as` collapses its whole
 * attribute map to `never`, so every other prop stops type-checking.
 */
const props = withDefaults(defineProps<{ as?: "div" | "li" }>(), { as: "div" });
</script>

<template>
  <Motion v-if="props.as === 'li'" as="li" class="js-reveal" :variants="revealVariants">
    <slot />
  </Motion>
  <Motion v-else as="div" class="js-reveal" :variants="revealVariants">
    <slot />
  </Motion>
</template>

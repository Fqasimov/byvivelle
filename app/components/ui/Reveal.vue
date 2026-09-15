<script setup lang="ts">
import { revealVariants, VIEWPORT } from "~/lib/motion";

/**
 * A single element rising out of blur as it enters the viewport.
 *
 * `as` is deliberately fixed to a literal: <Motion> is generic over its tag,
 * and handing it a non-literal string collapses its whole attribute map to
 * `never`, so every other prop stops type-checking.
 */
const props = withDefaults(
  defineProps<{
    /** Seconds to hold before starting — use sparingly, and under 0.3. */
    delay?: number;
  }>(),
  { delay: 0 },
);
</script>

<template>
  <Motion
    as="div"
    class="js-reveal"
    initial="hidden"
    while-in-view="visible"
    :in-view-options="VIEWPORT"
    :variants="revealVariants"
    :transition="{ delay: props.delay }"
  >
    <slot />
  </Motion>
</template>

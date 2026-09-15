<script setup lang="ts">
import { staggerVariants, VIEWPORT } from "~/lib/motion";

/** Wrap a group; every <StaggerItem> inside follows in sequence. */
const props = withDefaults(
  defineProps<{
    stagger?: number;
    delay?: number;
  }>(),
  { stagger: 0.07, delay: 0 },
);

const variants = computed(() => staggerVariants(props.stagger, props.delay));
</script>

<template>
  <Motion
    as="div"
    initial="hidden"
    while-in-view="visible"
    :in-view-options="VIEWPORT"
    :variants="variants"
  >
    <slot />
  </Motion>
</template>

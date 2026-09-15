<script setup lang="ts">
import { cn } from "~/lib/utils";

const props = withDefaults(
  defineProps<{
    eyebrow?: string;
    title: string;
    lead?: string;
    align?: "left" | "center";
  }>(),
  { align: "left" },
);

const centered = computed(() => props.align === "center");
</script>

<template>
  <div :class="cn('flex flex-col gap-5', centered && 'items-center text-center')">
    <Reveal v-if="props.eyebrow" class="flex items-center gap-3">
      <span aria-hidden="true" class="h-px w-8 bg-copper/45" />
      <span class="eyebrow">{{ props.eyebrow }}</span>
    </Reveal>

    <Reveal :delay="0.04">
      <h2
        :class="
          cn(
            'max-w-[18ch] text-4xl leading-[1.08] sm:text-5xl lg:text-[3.4rem]',
            centered && 'mx-auto max-w-[22ch]',
          )
        "
      >
        {{ props.title }}
      </h2>
    </Reveal>

    <Reveal v-if="props.lead" :delay="0.08">
      <p
        :class="
          cn(
            'max-w-[46ch] text-[0.975rem] leading-relaxed text-ink-muted',
            centered && 'mx-auto',
          )
        "
      >
        {{ props.lead }}
      </p>
    </Reveal>
  </div>
</template>

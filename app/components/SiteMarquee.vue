<script setup lang="ts">
const { t } = useLanguage();

/**
 * The tagline band. Two identical tracks sit side by side and the pair is
 * translated by exactly -50%, so the loop closes on itself with no seam and no
 * JavaScript running per frame.
 */
const items = computed(() => [...t.value.marquee, ...t.value.marquee, ...t.value.marquee]);
</script>

<template>
  <div class="relative overflow-hidden border-y border-line bg-ink py-3.5 text-paper">
    <div
      class="flex w-max animate-[bv-marquee_46s_linear_infinite] motion-reduce:animate-none"
      aria-hidden="true"
    >
      <ul v-for="track in 2" :key="track" class="flex shrink-0 items-center">
        <li v-for="(item, i) in items" :key="`${track}-${i}`" class="flex items-center">
          <span
            class="px-6 font-sans text-[0.6875rem] font-medium tracking-[0.22em] whitespace-nowrap uppercase"
          >
            {{ item }}
          </span>
          <span class="text-copper-light/70" aria-hidden="true">✦</span>
        </li>
      </ul>
    </div>

    <!-- Screen readers get the tagline once, not thirty-six times. -->
    <p class="sr-only">{{ t.marquee.join(" · ") }}</p>

    <!-- Fade the band into the page edges rather than cutting it. -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-ink to-transparent"
    />
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-ink to-transparent"
    />
  </div>
</template>

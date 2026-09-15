<script setup lang="ts">
import { VIEWPORT } from "~/lib/motion";

const { t } = useLanguage();
const root = useTemplateRef<HTMLElement>("root");
const reduced = useReducedMotion();

const { scrollYProgress } = useScroll({
  target: root,
  offset: ["start end", "end start"],
});

// A slow counter-drift inside the frame. The image is scaled past its box so
// the movement never exposes an edge.
const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
</script>

<template>
  <section id="about" class="bg-paper-warm py-24 sm:py-32 lg:py-(--spacing-section)">
    <div ref="root" class="container-page">
      <div class="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <!-- — photograph ————————————————————————— -->
        <Reveal class="lg:col-span-5">
          <figure class="relative">
            <div class="relative aspect-4/5 overflow-hidden rounded-[1.5rem] shadow-raise ring-1 ring-ink/[0.06]">
              <Motion
                :style="reduced ? undefined : { y: imageY }"
                class="absolute inset-x-0 -inset-y-[8%]"
              >
                <AppImage
                  src="/media/archive-cover.jpg"
                  alt=""
                  width="374"
                  height="468"
                  class="size-full object-cover"
                />
              </Motion>
            </div>

            <!-- Foil mark, echoing the stamped monogram on the envelopes. -->
            <div class="absolute -top-5 -right-5 hidden size-20 place-items-center rounded-full bg-paper shadow-lift ring-1 ring-ink/[0.06] sm:grid">
              <AppImage
                src="/media/logo.png"
                alt=""
                width="120"
                height="120"
                class="size-[4.25rem] rounded-full"
              />
            </div>
          </figure>
        </Reveal>

        <!-- — copy ——————————————————————————————— -->
        <div class="lg:col-span-6 lg:col-start-7">
          <Reveal class="flex items-center gap-3">
            <span aria-hidden="true" class="h-px w-8 bg-copper/45" />
            <span class="eyebrow">{{ t.about.eyebrow }}</span>
          </Reveal>

          <Reveal :delay="0.05">
            <h2 class="mt-5 max-w-[15ch] text-4xl leading-[1.08] sm:text-5xl">
              {{ t.about.title }}
            </h2>
          </Reveal>

          <Stagger :delay="0.1" class="mt-7 space-y-5">
            <StaggerItem v-for="paragraph in t.about.body" :key="paragraph">
              <p class="max-w-[52ch] leading-[1.75] text-ink-soft">{{ paragraph }}</p>
            </StaggerItem>
          </Stagger>

          <!-- — figures ————————————————————————— -->
          <Motion
            as="dl"
            initial="hidden"
            while-in-view="visible"
            :in-view-options="VIEWPORT"
            class="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-8"
          >
            <Motion
              v-for="(stat, i) in t.about.stats"
              :key="stat.label"
              :variants="{
                hidden: { opacity: 0, y: 12 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.12 + i * 0.08, duration: 0.6 },
                },
              }"
            >
              <dt class="sr-only">{{ stat.label }}</dt>
              <dd>
                <span class="block font-display text-[2rem] leading-none text-ink sm:text-[2.5rem]">
                  {{ stat.value }}
                </span>
                <span class="mt-2 block font-sans text-[0.75rem] leading-snug text-ink-muted">
                  {{ stat.label }}
                </span>
              </dd>
            </Motion>
          </Motion>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { EASE } from "~/lib/motion";

const { t } = useLanguage();
const root = useTemplateRef<HTMLElement>("root");
const reduced = useReducedMotion();

const { scrollYProgress } = useScroll({
  target: root,
  offset: ["start start", "end start"],
});

// The photograph drifts a little slower than the page, and dims as it goes.
const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
const imageOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.4]);
const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

const lines = computed(() => [t.value.hero.titleTop, t.value.hero.titleBottom]);
</script>

<template>
  <div id="top" ref="root" class="relative overflow-clip">
    <!-- Warm light falling from the top-left, the way it does in the brand
         photography. Cheap radial gradients, no image. -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10"
      style="
        background:
          radial-gradient(60rem 40rem at 12% -10%, rgb(255 252 247) 0%, transparent 62%),
          radial-gradient(48rem 34rem at 92% 8%, rgb(232 214 195 / 0.55) 0%, transparent 60%);
      "
    />

    <div class="container-page pt-32 pb-20 sm:pt-40 lg:pt-44 lg:pb-32">
      <div class="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <!-- ——— copy ——————————————————————————————— -->
        <Motion
          :style="reduced ? undefined : { y: textY }"
          class="lg:col-span-6 xl:col-span-5"
        >
          <Motion
            :initial="{ opacity: 0, y: 10 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.7, ease: EASE.outExpo, delay: 0.2 }"
            class="flex items-center gap-3"
          >
            <span aria-hidden="true" class="h-px w-8 bg-copper/50" />
            <span class="eyebrow">{{ t.hero.eyebrow }}</span>
          </Motion>

          <h1 class="mt-7 text-[clamp(2.75rem,7.5vw,5.25rem)] leading-[0.98] tracking-[-0.025em]">
            <!-- Each line is masked by its own overflow box, so the blur
                 reveal rises out of nothing instead of fading in place. -->
            <span
              v-for="(line, i) in lines"
              :key="line"
              class="block overflow-hidden pb-[0.08em]"
            >
              <Motion
                as="span"
                :initial="{ opacity: 0, y: '0.5em', filter: 'blur(10px)' }"
                :animate="{ opacity: 1, y: '0em', filter: 'blur(0px)' }"
                :transition="{ duration: 0.95, ease: EASE.outExpo, delay: 0.28 + i * 0.09 }"
                class="block"
              >
                <em v-if="i === 1" class="font-serif italic">{{ line }}</em>
                <template v-else>{{ line }}</template>
              </Motion>
            </span>
          </h1>

          <Motion
            as="p"
            :initial="{ opacity: 0, y: 12, filter: 'blur(5px)' }"
            :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
            :transition="{ duration: 0.8, ease: EASE.outExpo, delay: 0.52 }"
            class="mt-7 max-w-[44ch] text-[1.0625rem] leading-[1.65] text-ink-soft"
          >
            {{ t.hero.lead }}
          </Motion>

          <Motion
            :initial="{ opacity: 0, y: 12 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.7, ease: EASE.outExpo, delay: 0.64 }"
            class="mt-10 flex flex-wrap items-center gap-3"
          >
            <AppButton href="#collections">{{ t.hero.ctaPrimary }}</AppButton>
            <AppButton href="#process" variant="outline">
              {{ t.hero.ctaSecondary }}
            </AppButton>
          </Motion>
        </Motion>

        <!-- ——— photograph ————————————————————————— -->
        <Motion
          :style="reduced ? undefined : { y: imageY, opacity: imageOpacity }"
          class="relative lg:col-span-6 lg:col-start-7 xl:col-span-6 xl:col-start-7"
        >
          <Motion
            as="figure"
            :initial="{ opacity: 0, scale: 1.04, y: 24 }"
            :animate="{ opacity: 1, scale: 1, y: 0 }"
            :transition="{ duration: 1.3, ease: EASE.outExpo, delay: 0.18 }"
            class="relative"
          >
            <div class="relative overflow-hidden rounded-[1.75rem] shadow-float ring-1 ring-ink/[0.06]">
              <AppImage
                src="/media/wedding-cover.jpg"
                :alt="t.hero.caption"
                width="1400"
                height="1401"
                eager
                class="h-auto w-full"
              />
            </div>

            <!-- A detail lifted from the same photograph, framed as a circle —
                 the motif the collections section is built on. -->
            <Motion
              :initial="{ opacity: 0, scale: 0.8 }"
              :animate="{ opacity: 1, scale: 1 }"
              :transition="{ duration: 0.9, ease: EASE.outExpo, delay: 0.95 }"
              class="absolute -bottom-6 -left-6 hidden size-28 overflow-hidden rounded-full shadow-raise ring-4 ring-paper sm:block lg:-left-10 lg:size-32"
            >
              <AppImage
                src="/media/wedding-rings.jpg"
                alt=""
                width="281"
                height="281"
                class="size-full object-cover"
              />
            </Motion>

            <!-- Cleared past the circular inset that overlaps this corner. -->
            <figcaption class="mt-5 flex items-center gap-3 pl-1 sm:pl-28">
              <span aria-hidden="true" class="h-px w-6 bg-line-strong" />
              <span class="font-sans text-[0.75rem] tracking-[0.04em] text-ink-faint">
                {{ t.hero.caption }}
              </span>
            </figcaption>
          </Motion>
        </Motion>
      </div>
    </div>

    <!-- ——— scroll cue ————————————————————————————— -->
    <Motion
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{ duration: 0.8, delay: 1.2 }"
      :style="reduced ? undefined : { opacity: cueOpacity }"
      class="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center lg:flex"
    >
      <span class="flex flex-col items-center gap-2">
        <span class="eyebrow text-[0.625rem]">{{ t.hero.scroll }}</span>
        <span aria-hidden="true" class="relative block h-9 w-px overflow-hidden bg-line-strong">
          <Motion
            as="span"
            :animate="{ y: ['-100%', '100%'] }"
            :transition="{ duration: 2, ease: 'easeInOut', repeat: Infinity }"
            class="absolute inset-x-0 h-4 bg-copper"
          />
        </span>
      </span>
    </Motion>
  </div>
</template>

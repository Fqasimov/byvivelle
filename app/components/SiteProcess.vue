<script setup lang="ts">
import { EASE } from "~/lib/motion";

const { t } = useLanguage();
const list = useTemplateRef<HTMLElement>("list");

// The rule beside the steps fills as the list passes through the viewport.
const { scrollYProgress } = useScroll({
  target: list,
  offset: ["start 75%", "end 65%"],
});
const fill = useSpring(scrollYProgress, {
  stiffness: 120,
  damping: 28,
  restDelta: 0.001,
});
const scaleY = useTransform(fill, [0, 1], [0, 1]);
</script>

<template>
  <section id="process" class="py-24 sm:py-32 lg:py-(--spacing-section)">
    <div class="container-page">
      <div class="grid gap-16 lg:grid-cols-12 lg:gap-14">
        <!-- — sticky side ————————————————————————— -->
        <div class="lg:col-span-5">
          <div class="lg:sticky lg:top-28">
            <Reveal class="flex items-center gap-3">
              <span aria-hidden="true" class="h-px w-8 bg-copper/45" />
              <span class="eyebrow">{{ t.process.eyebrow }}</span>
            </Reveal>

            <Reveal :delay="0.05">
              <h2 class="mt-5 max-w-[14ch] text-4xl leading-[1.08] sm:text-5xl">
                {{ t.process.title }}
              </h2>
            </Reveal>

            <Reveal :delay="0.1">
              <figure class="mt-10 hidden overflow-hidden rounded-[1.5rem] shadow-raise ring-1 ring-ink/[0.06] lg:block">
                <AppImage
                  src="/media/process-book.jpg"
                  alt=""
                  width="511"
                  height="451"
                  class="h-auto w-full"
                />
              </figure>
            </Reveal>
          </div>
        </div>

        <!-- — steps ——————————————————————————————— -->
        <ol ref="list" class="relative lg:col-span-6 lg:col-start-7">
          <!-- Track + fill, drawn once for the whole list. -->
          <span aria-hidden="true" class="absolute top-2 bottom-2 left-0 w-px bg-line" />
          <Motion
            as="span"
            aria-hidden="true"
            :style="{ scaleY }"
            class="absolute top-2 bottom-2 left-0 w-px origin-top bg-copper"
          />

          <Motion
            v-for="step in t.process.steps"
            :key="step.n"
            as="li"
            :initial="{ opacity: 0, x: 18, filter: 'blur(6px)' }"
            while-in-view="visible"
            :variants="{ visible: { opacity: 1, x: 0, filter: 'blur(0px)' } }"
            :in-view-options="{ once: true, amount: 0.5 }"
            :transition="{ duration: 0.7, ease: EASE.outExpo }"
            class="relative pb-14 pl-10 last:pb-0 sm:pl-14"
          >
            <!-- Node on the rule. -->
            <Motion
              as="span"
              aria-hidden="true"
              :initial="{ scale: 0 }"
              while-in-view="visible"
              :variants="{ visible: { scale: 1 } }"
              :in-view-options="{ once: true, amount: 0.5 }"
              :transition="{ duration: 0.5, ease: EASE.outExpo, delay: 0.1 }"
              class="absolute top-2 -left-[3.5px] size-2 rounded-full bg-copper ring-4 ring-paper"
            />

            <span class="block font-sans text-[0.6875rem] font-medium tracking-[0.18em] text-copper-deep">
              {{ step.n }}
            </span>

            <h3 class="mt-3 text-[1.5rem] leading-snug sm:text-[1.75rem]">
              {{ step.title }}
            </h3>

            <p class="mt-3 max-w-[46ch] leading-[1.75] text-ink-muted">
              {{ step.body }}
            </p>
          </Motion>
        </ol>
      </div>
    </div>
  </section>
</template>

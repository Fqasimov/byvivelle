<script setup lang="ts">
import { EASE } from "~/lib/motion";
import { cn } from "~/lib/utils";

const { t } = useLanguage();

// Single-open accordion: two answers at once is two answers unread.
const open = ref<number | null>(0);
</script>

<template>
  <section id="faq" class="py-24 sm:py-32 lg:py-(--spacing-section)">
    <div class="container-page">
      <div class="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div class="lg:col-span-4">
          <div class="lg:sticky lg:top-28">
            <SectionHeading :eyebrow="t.faq.eyebrow" :title="t.faq.title" />
          </div>
        </div>

        <Stagger :stagger="0.06" class="lg:col-span-7 lg:col-start-6">
          <ul class="border-t border-line">
            <StaggerItem
              v-for="(item, i) in t.faq.items"
              :key="item.q"
              as="li"
              class="border-b border-line"
            >
              <h3>
                <button
                  :id="`faq-trigger-${i}`"
                  type="button"
                  :aria-expanded="open === i"
                  :aria-controls="`faq-panel-${i}`"
                  class="group flex w-full items-start justify-between gap-6 py-6 text-left"
                  @click="open = open === i ? null : i"
                >
                  <span
                    :class="
                      cn(
                        'font-display text-[1.125rem] leading-snug transition-colors duration-300 sm:text-[1.25rem]',
                        open === i ? 'text-ink' : 'text-ink-soft group-hover:text-ink',
                      )
                    "
                  >
                    {{ item.q }}
                  </span>

                  <!-- Plus that rotates into a minus — one bar turns. -->
                  <span aria-hidden="true" class="relative mt-1 grid size-6 shrink-0 place-items-center">
                    <span
                      class="absolute h-px w-3.5 bg-ink-muted transition-colors duration-300 group-hover:bg-ink"
                    />
                    <span
                      :class="
                        cn(
                          'absolute h-3.5 w-px bg-ink-muted transition-[transform,opacity,background-color] duration-[450ms] ease-[var(--ease-out-expo)] group-hover:bg-ink',
                          open === i && 'rotate-90 opacity-0',
                        )
                      "
                    />
                  </span>
                </button>
              </h3>

              <AnimatePresence :initial="false">
                <Motion
                  v-if="open === i"
                  :id="`faq-panel-${i}`"
                  role="region"
                  :aria-labelledby="`faq-trigger-${i}`"
                  :initial="{ height: 0, opacity: 0 }"
                  :animate="{ height: 'auto', opacity: 1 }"
                  :exit="{ height: 0, opacity: 0 }"
                  :transition="{
                    height: { duration: 0.42, ease: EASE.outExpo },
                    opacity: { duration: 0.25, ease: EASE.outQuart },
                  }"
                  class="overflow-hidden"
                >
                  <p class="max-w-[58ch] pr-10 pb-7 leading-[1.75] text-ink-muted">
                    {{ item.a }}
                  </p>
                </Motion>
              </AnimatePresence>
            </StaggerItem>
          </ul>
        </Stagger>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useLanguage();

const SHOTS = [
  { src: "/media/craft-leather.jpg", width: 293, height: 328 },
  { src: "/media/keepsake-seal.jpg", width: 363, height: 350 },
  { src: "/media/archive-pages.jpg", width: 445, height: 421 },
];
</script>

<template>
  <section id="craft" class="py-24 sm:py-32 lg:py-(--spacing-section)">
    <div class="container-page">
      <SectionHeading :eyebrow="t.craft.eyebrow" :title="t.craft.title" />

      <Stagger :stagger="0.1" :delay="0.08" class="mt-16 grid gap-10 sm:gap-12 lg:grid-cols-3">
        <StaggerItem v-for="(item, i) in t.craft.items" :key="item.title" class="group">
          <figure class="relative overflow-hidden rounded-[1.25rem] bg-paper-deep shadow-lift ring-1 ring-ink/[0.06]">
            <div class="aspect-4/3 overflow-hidden">
              <AppImage
                :src="SHOTS[i]!.src"
                alt=""
                :width="SHOTS[i]!.width"
                :height="SHOTS[i]!.height"
                class="size-full scale-[1.02] object-cover transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover:scale-110 motion-reduce:transition-none"
              />
            </div>
          </figure>

          <div class="mt-6 flex gap-5">
            <span
              aria-hidden="true"
              class="mt-1 font-sans text-[0.6875rem] font-medium tracking-[0.18em] text-copper-deep"
            >
              0{{ i + 1 }}
            </span>
            <div>
              <h3 class="text-[1.3125rem] leading-snug">{{ item.title }}</h3>
              <p class="mt-2.5 max-w-[42ch] leading-relaxed text-ink-muted">
                {{ item.body }}
              </p>
            </div>
          </div>
        </StaggerItem>
      </Stagger>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ALBUM_LIST, type AlbumId } from "~/lib/albums";
import { EASE, MORPH, VIEWPORT } from "~/lib/motion";
import { cn } from "~/lib/utils";

const { t } = useLanguage();
const reduced = useReducedMotion();

const activeId = ref<AlbumId | null>(null);
const active = computed(() =>
  activeId.value ? (ALBUM_LIST.find((a) => a.id === activeId.value) ?? null) : null,
);

// Focus goes back to the card that opened the album, not to the top of the
// page — the one thing keyboard users always notice.
const triggers = new Map<AlbumId, HTMLButtonElement>();
function registerTrigger(id: AlbumId, el: unknown) {
  if (el) triggers.set(id, el as HTMLButtonElement);
  else triggers.delete(id);
}

function close() {
  const id = activeId.value;
  activeId.value = null;
  if (id) window.setTimeout(() => triggers.get(id)?.focus(), 80);
}
</script>

<template>
  <section id="collections" class="relative py-24 sm:py-32 lg:py-(--spacing-section)">
    <div class="container-page">
      <SectionHeading
        :eyebrow="t.collections.eyebrow"
        :title="t.collections.title"
        :lead="t.collections.lead"
        align="center"
      />

      <!-- — the ring of covers ————————————————————————
           Sizes and vertical offsets vary per album so the row reads as a
           scatter of prints on a table rather than a grid of thumbnails. -->
      <ul class="mt-16 flex flex-wrap items-start justify-center gap-x-6 gap-y-12 sm:mt-20 sm:gap-x-8">
        <Motion
          v-for="(album, i) in ALBUM_LIST"
          :key="album.id"
          as="li"
          :initial="{ opacity: 0, y: 26, scale: 0.94 }"
          while-in-view="visible"
          :variants="{ visible: { opacity: 1, y: 0, scale: 1 } }"
          :in-view-options="VIEWPORT"
          :transition="{ duration: 0.75, ease: EASE.outExpo, delay: i * 0.08 }"
          class="flex flex-col items-center"
          :style="{ marginTop: reduced ? '0' : `${album.layout.offset * 0.25}rem` }"
        >
          <Motion
            :ref="(el: unknown) => registerTrigger(album.id, (el as { $el?: HTMLElement })?.$el ?? el)"
            as="button"
            type="button"
            :aria-label="`${t.collections.items[album.id].title} — ${t.collections.open}`"
            aria-haspopup="dialog"
            :while-hover="reduced ? undefined : { scale: 1.035 }"
            :while-tap="reduced ? undefined : { scale: 0.975 }"
            :transition="{ duration: 0.3, ease: EASE.outExpo }"
            class="group/card relative block cursor-pointer"
            :style="{
              width: `calc(var(--card-size) * ${album.layout.scale})`,
              height: `calc(var(--card-size) * ${album.layout.scale})`,
              // Local custom property keeps the five sizes in proportion at
              // every breakpoint from one number. Capped so all five covers
              // sit on one line at desktop instead of orphaning the fifth.
              '--card-size': 'clamp(8.75rem, 16vw, 13.25rem)',
            }"
            @click="activeId = album.id"
          >
            <!-- The shell is what morphs into the album panel. -->
            <Motion
              as="span"
              :layout-id="`album-shell-${album.id}`"
              :transition="MORPH"
              :style="{ borderRadius: '50%' }"
              :class="
                cn(
                  'absolute inset-0 block overflow-hidden bg-paper-deep shadow-lift ring-1 ring-ink/[0.06] transition-shadow duration-500 ease-[var(--ease-out-expo)]',
                  activeId !== album.id && 'group-hover/card:shadow-raise',
                )
              "
            >
              <AppImage
                :src="album.cover.src"
                alt=""
                :width="album.cover.width"
                :height="album.cover.height"
                class="size-full scale-105 object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover/card:scale-[1.14] motion-reduce:transition-none"
              />

              <!-- A wash that deepens on hover, so the centre chip stays
                   readable over any of the five covers. -->
              <span
                aria-hidden="true"
                class="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover/card:bg-ink/25"
              />

              <!-- Open affordance — sits still until you reach for it. -->
              <span
                aria-hidden="true"
                class="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 ease-[var(--ease-out-quart)] group-hover/card:opacity-100 group-focus-visible/card:opacity-100"
              >
                <span
                  class="flex items-center gap-1.5 rounded-full bg-paper/92 px-3.5 py-1.5 font-sans text-[0.625rem] font-medium tracking-[0.14em] uppercase text-ink backdrop-blur-sm"
                >
                  {{ t.collections.open }}
                </span>
              </span>
            </Motion>

            <!-- Hairline that draws itself around the circle on hover. -->
            <span
              aria-hidden="true"
              class="pointer-events-none absolute -inset-2 rounded-full border border-copper/0 transition-[border-color] duration-500 ease-[var(--ease-out-expo)] group-hover/card:border-copper/35"
            />
          </Motion>

          <div class="mt-5 max-w-[16rem] text-center">
            <p class="eyebrow text-[0.625rem]">
              {{ t.collections.items[album.id].kicker }}
            </p>
            <p class="mt-1 font-display text-[1.0625rem] leading-snug">
              {{ t.collections.items[album.id].title }}
            </p>
          </div>
        </Motion>
      </ul>

      <Motion
        as="p"
        :initial="{ opacity: 0 }"
        while-in-view="visible"
        :variants="{ visible: { opacity: 1 } }"
        :in-view-options="VIEWPORT"
        :transition="{ duration: 0.6, delay: 0.25 }"
        class="mt-16 text-center font-serif text-sm italic text-ink-faint"
      >
        {{ t.collections.hint }}
      </Motion>
    </div>

    <AnimatePresence>
      <AlbumViewer v-if="active" :key="active.id" :album="active" @close="close" />
    </AnimatePresence>
  </section>
</template>

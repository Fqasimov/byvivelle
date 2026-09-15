<script setup lang="ts">
import type { Album } from "~/lib/albums";
import { EASE, MORPH, TRANSITION } from "~/lib/motion";
import { INSTAGRAM_URL, cn } from "~/lib/utils";
import { lockScroll, unlockScroll } from "~/composables/useSmoothScroll";

const props = defineProps<{ album: Album }>();
const emit = defineEmits<{ close: [] }>();

const { t } = useLanguage();
const copy = computed(() => t.value.collections.items[props.album.id]);

const panel = useTemplateRef<HTMLElement>("panel");
const track = useTemplateRef<HTMLElement>("track");
const closeBtn = useTemplateRef<HTMLButtonElement>("closeBtn");

const index = ref(0);
const total = computed(() => props.album.pages.length);

/* — page navigation ————————————————————————————— */
function goTo(next: number) {
  const el = track.value;
  if (!el) return;

  const clamped = Math.max(0, Math.min(next, el.children.length - 1));
  const slide = el.children[clamped] as HTMLElement | undefined;
  if (!slide) return;

  // Scroll the track itself rather than `scrollIntoView`, which would also
  // walk up and nudge ancestor scroll containers.
  el.scrollTo({
    left: slide.offsetLeft - (el.clientWidth - slide.offsetWidth) / 2,
    behavior: "smooth",
  });
}

// Derive the active page from scroll position rather than tracking it in two
// places — swiping and the arrow buttons then agree by construction.
let raf = 0;
function onTrackScroll() {
  const el = track.value;
  if (!el) return;

  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    const centre = el.scrollLeft + el.clientWidth / 2;
    let nearest = 0;
    let best = Infinity;

    Array.from(el.children).forEach((child, i) => {
      const node = child as HTMLElement;
      const mid = node.offsetLeft + node.offsetWidth / 2;
      const dist = Math.abs(mid - centre);
      if (dist < best) {
        best = dist;
        nearest = i;
      }
    });

    index.value = nearest;
  });
}

/* — keyboard ————————————————————————————————————
   Escape closes, arrows page, Tab is trapped inside the dialog. */
function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") {
    e.preventDefault();
    emit("close");
    return;
  }

  if (e.key === "ArrowRight") {
    e.preventDefault();
    goTo(index.value + 1);
    return;
  }

  if (e.key === "ArrowLeft") {
    e.preventDefault();
    goTo(index.value - 1);
    return;
  }

  if (e.key !== "Tab") return;

  const root = panel.value;
  if (!root) return;

  const focusables = root.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );
  if (!focusables.length) return;

  const first = focusables[0]!;
  const last = focusables[focusables.length - 1]!;

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

let focusTimer = 0;
let previousOverflow = "";

onMounted(() => {
  lockScroll();
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  document.addEventListener("keydown", onKey);

  // Move focus in once the morph has settled, so the browser doesn't scroll
  // the panel mid-animation.
  focusTimer = window.setTimeout(() => closeBtn.value?.focus(), 360);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKey);
  document.body.style.overflow = previousOverflow;
  unlockScroll();
  window.clearTimeout(focusTimer);
  cancelAnimationFrame(raf);
});
</script>

<template>
  <div
    role="dialog"
    aria-modal="true"
    :aria-label="copy.title"
    class="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-6"
  >
    <!-- — backdrop ————————————————————————————————— -->
    <Motion
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      :transition="TRANSITION.fade"
      class="absolute inset-0 bg-ink/45 backdrop-blur-md"
      @click="emit('close')"
    />

    <!-- — panel: this is the circle, grown ————————————
         `layoutId` pairs it with the card that was tapped, so the cover
         physically becomes the album rather than a new box appearing.
         A definite height, not a max: the pages area is a flex child with an
         absolutely-positioned track, so there has to be real space to hand it. -->
    <Motion
      ref="panel"
      :layout-id="`album-shell-${album.id}`"
      :style="{ borderRadius: '26px' }"
      :transition="MORPH"
      class="relative flex h-[92dvh] max-h-[52rem] w-full max-w-5xl flex-col overflow-hidden bg-paper shadow-float"
    >
      <!-- Contents fade in just behind the morph — during the shape change
           there is nothing inside to distort. -->
      <Motion
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1, transition: { duration: 0.32, delay: 0.14 } }"
        :exit="{ opacity: 0, transition: { duration: 0.12 } }"
        class="flex min-h-0 flex-1 flex-col"
      >
        <!-- — header ———————————————————————————— -->
        <header class="flex items-start justify-between gap-6 border-b border-line px-5 py-4 sm:px-8 sm:py-6">
          <div class="min-w-0">
            <p class="eyebrow">{{ copy.kicker }}</p>
            <h3 class="mt-1.5 text-2xl leading-tight sm:text-[2rem]">{{ copy.title }}</h3>
            <p class="mt-2.5 hidden max-w-[62ch] text-sm leading-relaxed text-ink-muted sm:block">
              {{ copy.description }}
            </p>
          </div>

          <button
            ref="closeBtn"
            type="button"
            :aria-label="t.collections.viewer.close"
            class="flex size-9 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink-soft transition-[background-color,color,transform] duration-200 hover:scale-105 hover:bg-ink hover:text-paper active:scale-95"
            @click="emit('close')"
          >
            <svg width="12" height="12" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" stroke-width="1.3" />
            </svg>
          </button>
        </header>

        <!-- — pages ————————————————————————————— -->
        <div class="relative min-h-0 flex-1 overflow-hidden bg-paper-warm">
          <!-- Pinned to the slot rather than sized with `h-full`: a percentage
               height here resolves against the flex slot inconsistently and
               the track ends up viewport-tall, painting over the footer. -->
          <div
            ref="track"
            class="absolute inset-0 flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            @scroll.passive="onTrackScroll"
          >
            <div
              v-for="(page, i) in album.pages"
              :key="page.src + i"
              class="flex h-full w-full shrink-0 snap-center items-center justify-center p-5 sm:p-10"
            >
              <AppImage
                :src="page.src"
                :alt="copy.pages[i] ?? copy.title"
                :width="page.width"
                :height="page.height"
                :eager="i === 0"
                :class="
                  cn(
                    'max-h-full w-auto rounded-xl object-contain shadow-raise ring-1 ring-ink/[0.06]',
                    // Detail crops are small originals; showing them at full
                    // width would just be an enlargement of nothing.
                    page.span === 'inset' && 'max-w-[min(100%,26rem)]',
                  )
                "
              />
            </div>
          </div>

          <!-- — arrows: pointer users only ————————— -->
          <button
            type="button"
            :aria-label="t.collections.viewer.prev"
            :disabled="index === 0"
            class="absolute top-1/2 left-4 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-paper/85 text-ink shadow-lift ring-1 ring-ink/[0.07] backdrop-blur-sm transition-[opacity,transform,background-color] duration-200 hover:bg-paper active:scale-95 disabled:pointer-events-none disabled:opacity-0 sm:grid"
            @click="goTo(index - 1)"
          >
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
              <path d="M6 1L1 6l5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            :aria-label="t.collections.viewer.next"
            :disabled="index === total - 1"
            class="absolute top-1/2 right-4 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-paper/85 text-ink shadow-lift ring-1 ring-ink/[0.07] backdrop-blur-sm transition-[opacity,transform,background-color] duration-200 hover:bg-paper active:scale-95 disabled:pointer-events-none disabled:opacity-0 sm:grid"
            @click="goTo(index + 1)"
          >
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
              <path d="M1 1l5 5-5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        <!-- — footer ———————————————————————————— -->
        <footer class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line px-5 py-4 sm:px-8">
          <div class="flex min-w-0 items-center gap-4">
            <span class="font-sans text-[0.6875rem] tracking-[0.14em] text-ink-faint tabular-nums">
              {{ String(index + 1).padStart(2, "0") }}
              <span class="mx-1.5 text-line-strong">/</span>
              {{ String(total).padStart(2, "0") }}
            </span>

            <!-- Caption swaps with the page; keyed so it re-animates. -->
            <AnimatePresence mode="wait">
              <Motion
                :key="index"
                as="span"
                :initial="{ opacity: 0, y: 5 }"
                :animate="{ opacity: 1, y: 0 }"
                :exit="{ opacity: 0, y: -5 }"
                :transition="{ duration: 0.22, ease: EASE.outQuart }"
                class="truncate font-serif text-sm italic text-ink-muted"
              >
                {{ copy.pages[index] }}
              </Motion>
            </AnimatePresence>
          </div>

          <div class="flex items-center gap-4">
            <!-- Dots double as direct page selection. -->
            <div class="hidden items-center gap-1.5 sm:flex">
              <button
                v-for="(page, i) in album.pages"
                :key="page.src + i"
                type="button"
                :aria-label="`${t.collections.viewer.page} ${i + 1} ${t.collections.viewer.of} ${total}`"
                :aria-current="i === index"
                class="group/dot grid size-5 place-items-center"
                @click="goTo(i)"
              >
                <span
                  :class="
                    cn(
                      'block rounded-full transition-all duration-300 ease-[var(--ease-out-expo)]',
                      i === index
                        ? 'h-1.5 w-5 bg-copper-deep'
                        : 'size-1.5 bg-ink/18 group-hover/dot:bg-ink/35',
                    )
                  "
                />
              </button>
            </div>

            <a
              :href="INSTAGRAM_URL"
              target="_blank"
              rel="noreferrer noopener"
              class="group/cta inline-flex items-center gap-2 font-sans text-[0.6875rem] font-medium tracking-[0.12em] uppercase text-ink transition-colors hover:text-copper-deep"
            >
              {{ t.collections.viewer.order }}
              <span
                aria-hidden="true"
                class="transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover/cta:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </footer>
      </Motion>
    </Motion>
  </div>
</template>

<script setup lang="ts">
import { EASE, TRANSITION } from "~/lib/motion";
import { INSTAGRAM_URL, cn } from "~/lib/utils";

const { t } = useLanguage();
const { scrollY } = useScroll();

const condensed = ref(false);
const menuOpen = ref(false);

// One threshold with a dead zone, so a nudge at the boundary can't flicker the
// bar on and off.
useMotionValueEvent(scrollY, "change", (y: number) => {
  condensed.value = condensed.value ? y > 40 : y > 96;
});

const links = computed(() => [
  { href: "#collections", label: t.value.nav.collections },
  { href: "#process", label: t.value.nav.process },
  { href: "#occasions", label: t.value.nav.occasions },
  { href: "#order", label: t.value.nav.order },
]);

function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") menuOpen.value = false;
}

watch(menuOpen, (open) => {
  if (import.meta.server) return;
  document.body.style.overflow = open ? "hidden" : "";
  if (open) document.addEventListener("keydown", onKey);
  else document.removeEventListener("keydown", onKey);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKey);
  document.body.style.overflow = "";
});
</script>

<template>
  <Motion
    as="header"
    :initial="{ y: -24, opacity: 0 }"
    :animate="{ y: 0, opacity: 1 }"
    :transition="{ duration: 0.7, ease: EASE.outExpo, delay: 0.15 }"
    class="fixed inset-x-0 top-0 z-50"
  >
    <div
      :class="
        cn(
          'transition-[background-color,backdrop-filter,border-color] duration-500 ease-[var(--ease-out-quart)]',
          condensed
            ? 'border-b border-line bg-paper/72 backdrop-blur-xl backdrop-saturate-150'
            : 'border-b border-transparent bg-transparent',
        )
      "
    >
      <nav class="container-page flex items-center justify-between gap-6 py-4">
        <!-- — mark ——————————————————————————— -->
        <a href="#top" class="group flex items-center gap-2.5" aria-label="byvivelle — home">
          <AppImage
            src="/media/logo.png"
            alt=""
            width="72"
            height="72"
            eager
            :class="
              cn(
                'rounded-full ring-1 ring-ink/5 transition-[width,height] duration-500 ease-[var(--ease-out-quart)]',
                condensed ? 'size-8' : 'size-10',
              )
            "
          />
          <span class="font-display text-[1.0625rem] tracking-[-0.01em] lowercase">
            byvivelle
          </span>
        </a>

        <!-- — links ——————————————————————————— -->
        <ul class="hidden items-center gap-1 lg:flex">
          <li v-for="link in links" :key="link.href">
            <a
              :href="link.href"
              class="group relative block px-3.5 py-2 font-sans text-[0.8125rem] text-ink-soft transition-colors duration-200 hover:text-ink"
            >
              {{ link.label }}
              <span
                aria-hidden="true"
                class="absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-copper transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
              />
            </a>
          </li>
        </ul>

        <!-- — actions —————————————————————————— -->
        <div class="flex items-center gap-2.5">
          <LanguageSwitcher class="hidden sm:inline-flex" />

          <AppButton
            :href="INSTAGRAM_URL"
            external
            size="sm"
            class="hidden sm:inline-flex"
          >
            {{ t.nav.cta }}
          </AppButton>

          <button
            type="button"
            :aria-label="t.nav.menu"
            :aria-expanded="menuOpen"
            class="flex size-9 items-center justify-center rounded-full border border-line-strong text-ink transition-colors duration-200 hover:bg-ink/[0.04] lg:hidden"
            @click="menuOpen = true"
          >
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none" aria-hidden="true">
              <path d="M0 1h15M0 5.5h15M0 10h10" stroke="currentColor" stroke-width="1.2" />
            </svg>
          </button>
        </div>
      </nav>
    </div>
  </Motion>

  <!-- — mobile menu ——————————————————————————— -->
  <AnimatePresence>
    <Motion
      v-if="menuOpen"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      :transition="TRANSITION.fade"
      class="fixed inset-0 z-60 bg-ink text-paper lg:hidden"
    >
      <div class="container-page flex h-full flex-col">
        <div class="flex items-center justify-between py-4">
          <span class="font-display text-[1.0625rem] lowercase">byvivelle</span>
          <button
            type="button"
            :aria-label="t.nav.close"
            class="flex size-9 items-center justify-center rounded-full border border-paper/20 transition-colors duration-200 hover:bg-paper/10"
            @click="menuOpen = false"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" stroke-width="1.2" />
            </svg>
          </button>
        </div>

        <ul class="flex flex-1 flex-col justify-center gap-1">
          <Motion
            v-for="(link, i) in links"
            :key="link.href"
            as="li"
            :initial="{ opacity: 0, y: 18, filter: 'blur(6px)' }"
            :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
            :transition="{ duration: 0.5, ease: EASE.outExpo, delay: 0.06 + i * 0.05 }"
          >
            <a
              :href="link.href"
              class="block border-b border-paper/10 py-5 font-display text-[2rem] leading-none"
              @click="menuOpen = false"
            >
              {{ link.label }}
            </a>
          </Motion>
        </ul>

        <div class="flex items-center justify-between gap-4 pb-10">
          <LanguageSwitcher tone="dark" />
          <AppButton
            :href="INSTAGRAM_URL"
            external
            size="sm"
            variant="inverse"
          >
            {{ t.nav.cta }}
          </AppButton>
        </div>
      </div>
    </Motion>
  </AnimatePresence>
</template>

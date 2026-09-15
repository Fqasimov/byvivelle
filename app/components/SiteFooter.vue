<script setup lang="ts">
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "~/lib/utils";

const { t } = useLanguage();
const year = new Date().getFullYear();

const links = computed(() => [
  { href: "#collections", label: t.value.nav.collections },
  { href: "#process", label: t.value.nav.process },
  { href: "#occasions", label: t.value.nav.occasions },
  { href: "#faq", label: t.value.faq.eyebrow },
]);
</script>

<template>
  <footer class="border-t border-line bg-paper">
    <div class="container-page py-20 sm:py-24">
      <Reveal class="grid gap-14 lg:grid-cols-12">
        <!-- — mark ————————————————————————————————— -->
        <div class="lg:col-span-5">
          <div class="flex items-center gap-3">
            <AppImage
              src="/media/logo.png"
              alt=""
              width="112"
              height="112"
              class="size-14 rounded-full ring-1 ring-ink/5"
            />
            <div>
              <p class="font-display text-xl lowercase">byvivelle</p>
              <p class="mt-0.5 font-sans text-[0.625rem] tracking-[0.2em] uppercase text-ink-faint">
                {{ t.footer.tagline }}
              </p>
            </div>
          </div>

          <p class="mt-8 max-w-[34ch] font-serif text-[1.375rem] leading-snug italic text-ink-soft">
            {{ t.footer.collect }}
          </p>
        </div>

        <!-- — nav ——————————————————————————————————— -->
        <nav class="lg:col-span-3 lg:col-start-7">
          <p class="eyebrow">{{ t.footer.nav }}</p>
          <ul class="mt-5 space-y-3">
            <li v-for="link in links" :key="link.href">
              <a
                :href="link.href"
                class="group inline-flex items-center gap-2 text-[0.9375rem] text-ink-soft transition-colors duration-200 hover:text-ink"
              >
                <span
                  aria-hidden="true"
                  class="h-px w-0 bg-copper transition-[width] duration-300 ease-[var(--ease-out-expo)] group-hover:w-4"
                />
                {{ link.label }}
              </a>
            </li>
          </ul>
        </nav>

        <!-- — contact ———————————————————————————————— -->
        <div class="lg:col-span-3">
          <p class="eyebrow">{{ t.footer.contact }}</p>
          <ul class="mt-5 space-y-3 text-[0.9375rem] text-ink-soft">
            <li>
              <a
                :href="INSTAGRAM_URL"
                target="_blank"
                rel="noreferrer noopener"
                class="group inline-flex items-center gap-2 transition-colors duration-200 hover:text-ink"
              >
                {{ INSTAGRAM_HANDLE }}
                <span
                  aria-hidden="true"
                  class="transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </li>
            <li class="text-ink-muted">{{ t.footer.madeIn }}</li>
          </ul>

          <LanguageSwitcher class="mt-7" />
        </div>
      </Reveal>

      <div class="mt-16 flex flex-col-reverse items-start justify-between gap-5 border-t border-line pt-7 sm:flex-row sm:items-center">
        <p class="font-sans text-[0.75rem] text-ink-faint">
          © {{ year }} byvivelle. {{ t.footer.rights }}
        </p>
        <p class="font-sans text-[0.75rem] tracking-[0.14em] uppercase text-ink-faint">
          {{ t.footer.madeIn }}
        </p>
      </div>
    </div>
  </footer>
</template>

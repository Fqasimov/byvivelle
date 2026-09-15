<script setup lang="ts">
import { TRANSITION } from "~/lib/motion";
import { cn } from "~/lib/utils";

/**
 * Segmented control. The active pill is a single shared element that slides
 * between options via `layoutId`, so switching language reads as one object
 * moving rather than two opacity changes.
 */
const props = withDefaults(defineProps<{ tone?: "light" | "dark" }>(), {
  tone: "light",
});

const { lang, setLang, t } = useLanguage();

// This control is rendered more than once (nav, mobile menu, footer). A shared
// layoutId would make Motion treat every copy as the same element and fly the
// pill between them, landing it in the wrong slot.
const instanceId = useId();
</script>

<template>
  <div
    role="group"
    :aria-label="t.nav.language"
    :class="
      cn(
        'relative inline-flex items-center rounded-full p-[3px]',
        props.tone === 'light'
          ? 'bg-ink/[0.045] ring-1 ring-ink/5'
          : 'bg-paper/10 ring-1 ring-paper/15',
      )
    "
  >
    <button
      v-for="option in LANGUAGES"
      :key="option.code"
      type="button"
      :aria-pressed="option.code === lang"
      :aria-label="option.name"
      :class="
        cn(
          'relative rounded-full px-2.5 py-1 font-sans text-[0.6875rem] font-medium tracking-[0.1em] transition-colors duration-200',
          props.tone === 'light'
            ? option.code === lang
              ? 'text-paper'
              : 'text-ink-muted hover:text-ink'
            : option.code === lang
              ? 'text-ink'
              : 'text-paper/60 hover:text-paper',
        )
      "
      @click="setLang(option.code)"
    >
      <Motion
        v-if="option.code === lang"
        as="span"
        :layout-id="`lang-pill-${instanceId}`"
        :transition="TRANSITION.quick"
        :class="
          cn(
            'absolute inset-0 rounded-full',
            props.tone === 'light' ? 'bg-ink' : 'bg-paper',
          )
        "
      />
      <span class="relative z-10">{{ option.label }}</span>
    </button>
  </div>
</template>

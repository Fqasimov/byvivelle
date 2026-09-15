<script setup lang="ts">
/**
 * All site imagery is pre-encoded to avif/webp/jpg by scripts/prepare-assets.mjs,
 * so this is a plain <picture> rather than a runtime image service. Two reasons:
 *
 *  · the album viewer only exists after a click, so a static export never
 *    prerenders optimised variants for it — those URLs would 404 on any
 *    static host
 *  · the assets are already cut to the sizes the layout asks for, so there is
 *    nothing left for a resizing server to do
 *
 * One file per format, so there is no srcset to choose between and no `sizes`
 * to declare. `width`/`height` are always passed, so the box is reserved
 * before the bytes land — nothing on this page is allowed to shift.
 */
const props = withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    width: number | string;
    height: number | string;
    /** Above the fold — skips lazy loading and hints high priority. */
    eager?: boolean;
  }>(),
  { alt: "", eager: false },
);

// Classes belong on the <img>, not the wrapper, or every object-cover and
// size utility would land on an element that isn't the picture. `display:
// contents` then removes <picture> from layout entirely, so callers can treat
// this exactly like a bare <img>.
defineOptions({ inheritAttrs: false });

const avif = computed(() => props.src.replace(/\.(jpg|png)$/, ".avif"));
const webp = computed(() => props.src.replace(/\.(jpg|png)$/, ".webp"));
</script>

<template>
  <picture class="contents">
    <source :srcset="avif" type="image/avif" />
    <source :srcset="webp" type="image/webp" />
    <img
      v-bind="$attrs"
      :src="props.src"
      :alt="props.alt"
      :width="props.width"
      :height="props.height"
      :loading="props.eager ? 'eager' : 'lazy'"
      :fetchpriority="props.eager ? 'high' : undefined"
      decoding="async"
    />
  </picture>
</template>

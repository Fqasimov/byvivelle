<script setup lang="ts">
const { lang, restoreLang } = useLanguage();

useSmoothScroll();

// English renders on both server and client; a stored preference is applied
// after hydration so the markup matches.
onMounted(restoreLang);

// Keep <html lang> honest for screen readers and hyphenation.
useHead({
  htmlAttrs: { lang },
  bodyAttrs: { class: "grain antialiased" },
});

useSeoMeta({
  title: "byvivelle — Personal journals made from your memories",
  description:
    "byvivelle turns your photographs and memories into a personal printed magazine. Wedding, birthday and love editions, handmade in Baku and delivered worldwide.",
  ogTitle: "byvivelle — Stories that stay with you",
  ogDescription:
    "Personal printed magazines made from your photographs and memories. Handmade in Baku, delivered worldwide.",
  ogImage: "/media/wedding-cover.jpg",
  ogType: "website",
});
</script>

<template>
  <NuxtPage />
</template>

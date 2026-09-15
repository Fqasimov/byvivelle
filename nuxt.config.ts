import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  devtools: { enabled: false },

  modules: ["motion-v/nuxt"],

  // Flat component names (<Reveal>, not <UiReveal>) despite the ui/ folder.
  components: [{ path: "~/components", pathPrefix: false }],

  css: ["~/assets/css/main.css"],

  vite: {
    // Tailwind v4 runs as a Vite plugin; no postcss config needed.
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      htmlAttrs: { lang: "en" },
      noscript: [
        {
          // Scroll reveals start at opacity 0 via inline style. With scripting
          // off nothing ever reveals them, so the copy would simply be gone.
          innerHTML:
            "<style>.js-reveal{opacity:1!important;filter:none!important;transform:none!important}</style>",
          tagPosition: "head",
        },
      ],
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#faf6f0" },
        { name: "color-scheme", content: "light" },
      ],
      link: [{ rel: "icon", href: "/media/logo.png" }],
    },
  },


  nitro: {
    prerender: { crawlLinks: true, routes: ["/"] },
  },
});

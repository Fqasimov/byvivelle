# byvivelle

Marketing site for **byvivelle** — personal printed magazines made from customers'
photographs and memories. Handmade in Baku, delivered worldwide.

Next.js 16 · React 19 · Tailwind CSS v4 · Motion · Lenis. Fully static output.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

---

## The collections feature

The centrepiece is the collections section: five editions shown as circular
covers, scattered rather than gridded. Tapping one opens the full album.

The circle and the album panel share a `layoutId`, so the cover physically
*becomes* the album — it grows and un-rounds into the panel rather than a new
box appearing over it. The panel's contents fade in a beat behind the morph,
which is what stops the header and footer distorting while the shape changes.

Inside, pages are a snap-scrolling track. Every way of moving through it agrees
because the active page is derived from scroll position, not tracked separately:
swipe, the arrow buttons, the footer dots and the ← → keys all write to the same
place. Escape closes, Tab is trapped in the dialog, focus moves in after the
morph settles and returns to the card that opened it.

Album content lives in `src/lib/albums.ts`; the prose for each one is in the
dictionary (below), keyed by album id.

## Languages

byvivelle sells in Russian and Azerbaijani and markets in English, so all three
are first-class. `src/lib/i18n.tsx` holds the dictionary; the Russian and
Azerbaijani trees are type-checked against the English one, so a missing or
misspelled key fails the build.

Choice persists in `localStorage`, falls back to the browser locale, and renders
English first so server and client markup agree.

Display type is **Prata**, which has Cyrillic but no `latin-ext` — so
Azerbaijani `ə ğ ş` fall through per-glyph to **Playfair Display**, sitting next
in the `--font-display` stack. Between two high-contrast serifs the swap is
effectively invisible, and it keeps Azerbaijani headings from collapsing to a
system font.

## Motion

`src/lib/motion.ts` is the whole vocabulary — curves, durations and the shared
entrance variants. Some rules it encodes:

- Nothing travels further than ~16px. Distance reads as cheap.
- Entrances rise out of a short blur; that is what stops them reading as a
  generic fade-up.
- Only the album morph is a spring. Everything else is a duration.
- `prefers-reduced-motion` disables Lenis, the parallax and the hover scales.

Scroll reveals set `opacity: 0` inline, so a `<noscript>` rule in the layout
unhides anything marked `data-reveal` when scripting is off.

## Assets

The brand collateral arrived as phone screenshots of an Instagram carousel —
each frame carrying a translucent `3/6` pager badge, black letterbox bars, and
in several cases burned-in marketing copy.

`scripts/prepare-assets.mjs` turns those into web assets: it trims the
letterbox, erases the pager badge by feathering a blurred patch of neighbouring
background over it, and cuts editorial detail crops (a spread's polaroid
cluster, the foil monogram on an envelope) that give each album real pages to
leaf through. Crops are also chosen to exclude the burned-in carousel copy, so
no frame on the site reads as a screenshot.

```bash
node scripts/prepare-assets.mjs   # regenerates public/media
node scripts/shoot.mjs            # screenshots each section for review
```

`src/lib/media.json` is a generated manifest of every asset's real dimensions,
so images are never sized by guesswork.

## Before launch

- `INSTAGRAM_URL` in `src/lib/utils.ts` points at `instagram.com/byvivelle` —
  confirm the handle.
- `metadataBase` in `src/app/layout.tsx` is a placeholder domain.
- Several detail crops come from low-resolution sources and are soft at large
  sizes. Re-shooting the products would lift the whole page.

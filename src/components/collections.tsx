"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ALBUM_LIST, type Album, type AlbumId } from "@/lib/albums";
import { useT } from "@/lib/i18n";
import { EASE, MORPH, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Section, SectionHeading } from "./ui/section";
import { AlbumViewer } from "./album-viewer";

export function Collections() {
  const t = useT();
  const [activeId, setActiveId] = useState<AlbumId | null>(null);
  // Focus goes back to the card that opened the album, not to the top of
  // the page — the one thing keyboard users always notice.
  const triggerRefs = useRef<Partial<Record<AlbumId, HTMLButtonElement | null>>>({});

  const active: Album | null = activeId
    ? (ALBUM_LIST.find((a) => a.id === activeId) ?? null)
    : null;

  const close = () => {
    const id = activeId;
    setActiveId(null);
    if (id) window.setTimeout(() => triggerRefs.current[id]?.focus(), 80);
  };

  return (
    <Section id="collections" className="relative">
      <div className="container-page">
        <SectionHeading
          eyebrow={t.collections.eyebrow}
          title={t.collections.title}
          lead={t.collections.lead}
          align="center"
        />

        {/* — the ring of covers ————————————————————————
            Sizes and vertical offsets vary per album so the row reads as a
            scatter of prints on a table rather than a grid of thumbnails. */}
        <ul className="mt-16 flex flex-wrap items-start justify-center gap-x-6 gap-y-12 sm:mt-20 sm:gap-x-8">
          {ALBUM_LIST.map((album, i) => (
            <AlbumCard
              key={album.id}
              album={album}
              index={i}
              isOpen={activeId === album.id}
              onOpen={() => setActiveId(album.id)}
              registerRef={(el) => {
                triggerRefs.current[album.id] = el;
              }}
            />
          ))}
        </ul>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-16 text-center font-serif text-sm italic text-ink-faint"
        >
          {t.collections.hint}
        </motion.p>
      </div>

      <AlbumViewer album={active} onClose={close} />
    </Section>
  );
}

function AlbumCard({
  album,
  index,
  isOpen,
  onOpen,
  registerRef,
}: {
  album: Album;
  index: number;
  isOpen: boolean;
  onOpen: () => void;
  registerRef: (el: HTMLButtonElement | null) => void;
}) {
  const t = useT();
  const copy = t.collections.items[album.id];
  const reduced = useReducedMotion();
  const { scale, offset } = album.layout;

  return (
    <motion.li
      initial={{ opacity: 0, y: 26, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.75, ease: EASE.outExpo, delay: index * 0.08 }}
      className="flex flex-col items-center"
      style={{ marginTop: reduced ? 0 : `${offset * 0.25}rem` }}
    >
      <motion.button
        ref={registerRef}
        type="button"
        onClick={onOpen}
        aria-label={`${copy.title} — ${t.collections.open}`}
        aria-haspopup="dialog"
        whileHover={reduced ? undefined : { scale: 1.035 }}
        whileTap={reduced ? undefined : { scale: 0.975 }}
        transition={{ duration: 0.3, ease: EASE.outExpo }}
        className="group/card relative block cursor-pointer"
        style={{
          width: `calc(var(--card-size) * ${scale})`,
          height: `calc(var(--card-size) * ${scale})`,
          // Local custom property keeps the five sizes in proportion at
          // every breakpoint from one number. Capped so all five covers sit
          // on one line at desktop instead of orphaning the fifth.
          ["--card-size" as string]: "clamp(8.75rem, 16vw, 13.25rem)",
        }}
      >
        {/* The shell is what morphs into the album panel. */}
        <motion.span
          layoutId={`album-shell-${album.id}`}
          transition={MORPH}
          style={{ borderRadius: "50%" }}
          className={cn(
            "absolute inset-0 block overflow-hidden bg-paper-deep shadow-lift ring-1 ring-ink/[0.06] transition-shadow duration-500 ease-[var(--ease-out-expo)]",
            !isOpen && "group-hover/card:shadow-raise",
          )}
        >
          <Image
            src={album.cover.src}
            alt=""
            width={album.cover.width}
            height={album.cover.height}
            sizes="(max-width: 640px) 45vw, 248px"
            className="size-full scale-105 object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover/card:scale-[1.14] motion-reduce:transition-none"
          />

          {/* A wash that deepens on hover, so the centre chip stays readable
              over any of the five covers. */}
          <span
            aria-hidden
            className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover/card:bg-ink/25"
          />

          {/* Open affordance — sits still until you reach for it. */}
          <span
            aria-hidden
            className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 ease-[var(--ease-out-quart)] group-hover/card:opacity-100 group-focus-visible/card:opacity-100"
          >
            <span className="flex items-center gap-1.5 rounded-full bg-paper/92 px-3.5 py-1.5 font-sans text-[0.625rem] font-medium tracking-[0.14em] uppercase text-ink backdrop-blur-sm">
              {t.collections.open}
            </span>
          </span>
        </motion.span>

        {/* Hairline that draws itself around the circle on hover. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-2 rounded-full border border-copper/0 transition-[border-color,inset] duration-500 ease-[var(--ease-out-expo)] group-hover/card:border-copper/35"
        />
      </motion.button>

      <div className="mt-5 max-w-[16rem] text-center">
        <p className="eyebrow text-[0.625rem]">{copy.kicker}</p>
        <p className="mt-1 font-display text-[1.0625rem] leading-snug">
          {copy.title}
        </p>
      </div>
    </motion.li>
  );
}

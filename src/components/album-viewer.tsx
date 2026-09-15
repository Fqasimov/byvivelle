"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Album } from "@/lib/albums";
import { useT } from "@/lib/i18n";
import { EASE, MORPH, TRANSITION } from "@/lib/motion";
import { INSTAGRAM_URL, cn } from "@/lib/utils";
import { lockScroll, unlockScroll } from "./smooth-scroll";

type Props = {
  album: Album | null;
  onClose: () => void;
};

export function AlbumViewer({ album, onClose }: Props) {
  return (
    <AnimatePresence>
      {album ? <ViewerBody key={album.id} album={album} onClose={onClose} /> : null}
    </AnimatePresence>
  );
}

function ViewerBody({ album, onClose }: { album: Album; onClose: () => void }) {
  const t = useT();
  const copy = t.collections.items[album.id];

  const panelRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(0);

  const total = album.pages.length;

  /* — page navigation ————————————————————————————— */
  const goTo = useCallback((next: number) => {
    const track = trackRef.current;
    if (!track) return;

    const clamped = Math.max(0, Math.min(next, track.children.length - 1));
    const slide = track.children[clamped] as HTMLElement | undefined;
    if (!slide) return;

    // Scroll the track itself rather than `scrollIntoView`, which would also
    // walk up and nudge ancestor scroll containers.
    track.scrollTo({
      left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, []);

  // Derive the active page from scroll position rather than tracking it in
  // two places — swiping and the arrow buttons then agree by construction.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const centre = track.scrollLeft + track.clientWidth / 2;
        let nearest = 0;
        let best = Infinity;

        Array.from(track.children).forEach((child, i) => {
          const el = child as HTMLElement;
          const mid = el.offsetLeft + el.offsetWidth / 2;
          const dist = Math.abs(mid - centre);
          if (dist < best) {
            best = dist;
            nearest = i;
          }
        });

        setIndex(nearest);
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* — scroll lock ————————————————————————————————— */
  useEffect(() => {
    lockScroll();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
      unlockScroll();
    };
  }, []);

  /* — keyboard ————————————————————————————————————
     Escape closes, arrows page, Tab is trapped inside the dialog. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(index + 1);
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(index - 1);
        return;
      }

      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [goTo, index, onClose]);

  // Move focus in once the morph has settled, so the browser doesn't scroll
  // the panel mid-animation.
  useEffect(() => {
    const id = window.setTimeout(() => closeRef.current?.focus(), 360);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
      className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-6"
    >
      {/* — backdrop ————————————————————————————————— */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={TRANSITION.fade}
        onClick={onClose}
        className="absolute inset-0 bg-ink/45 backdrop-blur-md"
      />

      {/* — panel: this is the circle, grown ————————————
          `layoutId` pairs it with the card that was tapped, so the cover
          physically becomes the album rather than a new box appearing. */}
      <motion.div
        ref={panelRef}
        layoutId={`album-shell-${album.id}`}
        style={{ borderRadius: 26 }}
        transition={MORPH}
        // A definite height, not a max: the pages area is a flex child with an
        // absolutely-positioned track, so there has to be real space to hand it.
        className="relative flex h-[92dvh] max-h-[52rem] w-full max-w-5xl flex-col overflow-hidden bg-paper shadow-float"
      >
        {/* Contents fade in just behind the morph — during the shape change
            there is nothing inside to distort. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.32, delay: 0.14 } }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* — header ———————————————————————————— */}
          <header className="flex items-start justify-between gap-6 border-b border-line px-5 py-4 sm:px-8 sm:py-6">
            <div className="min-w-0">
              <p className="eyebrow">{copy.kicker}</p>
              <h3 className="mt-1.5 text-2xl leading-tight sm:text-[2rem]">
                {copy.title}
              </h3>
              <p className="mt-2.5 hidden max-w-[62ch] text-sm leading-relaxed text-ink-muted sm:block">
                {copy.description}
              </p>
            </div>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t.collections.viewer.close}
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink-soft transition-[background-color,color,transform] duration-200 hover:scale-105 hover:bg-ink hover:text-paper active:scale-95"
            >
              <svg width="12" height="12" viewBox="0 0 13 13" fill="none" aria-hidden>
                <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </button>
          </header>

          {/* — pages ————————————————————————————— */}
          <div className="relative min-h-0 flex-1 overflow-hidden bg-paper-warm">
            {/* Pinned to the slot rather than sized with `h-full`: a percentage
                height here resolves against the flex slot inconsistently and
                the track ends up viewport-tall, painting over the footer. */}
            <div
              ref={trackRef}
              className="absolute inset-0 flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {album.pages.map((page, i) => (
                <div
                  key={page.src + i}
                  className="flex h-full w-full shrink-0 snap-center items-center justify-center p-5 sm:p-10"
                >
                  <Image
                    src={page.src}
                    alt={copy.pages[i] ?? copy.title}
                    width={page.width}
                    height={page.height}
                    sizes="(max-width: 640px) 90vw, 900px"
                    priority={i === 0}
                    className={cn(
                      "max-h-full w-auto rounded-xl object-contain shadow-raise ring-1 ring-ink/[0.06]",
                      // Detail crops are small originals; showing them at full
                      // width would just be an enlargement of nothing.
                      page.span === "inset" && "max-w-[min(100%,26rem)]",
                    )}
                  />
                </div>
              ))}
            </div>

            {/* — arrows: pointer users only ————————— */}
            <PageButton
              side="left"
              label={t.collections.viewer.prev}
              disabled={index === 0}
              onClick={() => goTo(index - 1)}
            />
            <PageButton
              side="right"
              label={t.collections.viewer.next}
              disabled={index === total - 1}
              onClick={() => goTo(index + 1)}
            />
          </div>

          {/* — footer ———————————————————————————— */}
          <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line px-5 py-4 sm:px-8">
            <div className="flex min-w-0 items-center gap-4">
              <span className="font-sans text-[0.6875rem] tracking-[0.14em] text-ink-faint tabular-nums">
                {String(index + 1).padStart(2, "0")}
                <span className="mx-1.5 text-line-strong">/</span>
                {String(total).padStart(2, "0")}
              </span>

              {/* Caption swaps with the page; keyed so it re-animates. */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.22, ease: EASE.outQuart }}
                  className="truncate font-serif text-sm italic text-ink-muted"
                >
                  {copy.pages[index]}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-4">
              {/* Dots double as direct page selection. */}
              <div className="hidden items-center gap-1.5 sm:flex">
                {album.pages.map((page, i) => (
                  <button
                    key={page.src + i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`${t.collections.viewer.page} ${i + 1} ${t.collections.viewer.of} ${total}`}
                    aria-current={i === index}
                    className="group/dot grid size-5 place-items-center"
                  >
                    <span
                      className={cn(
                        "block rounded-full transition-all duration-300 ease-[var(--ease-out-expo)]",
                        i === index
                          ? "h-1.5 w-5 bg-copper-deep"
                          : "size-1.5 bg-ink/18 group-hover/dot:bg-ink/35",
                      )}
                    />
                  </button>
                ))}
              </div>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="group/cta inline-flex items-center gap-2 font-sans text-[0.6875rem] font-medium tracking-[0.12em] uppercase text-ink transition-colors hover:text-copper-deep"
              >
                {t.collections.viewer.order}
                <span
                  aria-hidden
                  className="transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover/cta:translate-x-1"
                >
                  →
                </span>
              </a>
            </div>
          </footer>
        </motion.div>
      </motion.div>
    </div>
  );
}

function PageButton({
  side,
  label,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "absolute top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-paper/85 text-ink shadow-lift ring-1 ring-ink/[0.07] backdrop-blur-sm transition-[opacity,transform,background-color] duration-200 hover:bg-paper active:scale-95 disabled:pointer-events-none disabled:opacity-0 sm:grid",
        side === "left" ? "left-4" : "right-4",
      )}
    >
      <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden>
        <path
          d={side === "left" ? "M6 1L1 6l5 5" : "M1 1l5 5-5 5"}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

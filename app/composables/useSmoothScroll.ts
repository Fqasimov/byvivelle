import Lenis from "lenis";

/**
 * Lenis is deliberately understated here: enough damping that long scrolls feel
 * weighted, not so much that the page lags behind the wheel.
 *
 * The instance is parked on a module singleton so the album viewer can freeze
 * the page behind it — two competing scroll systems is the usual way smooth
 * scroll goes wrong.
 */

let instance: Lenis | null = null;

export function lockScroll() {
  instance?.stop();
}

export function unlockScroll() {
  instance?.start();
}

/** Mounted once, from the app root. */
export function useSmoothScroll() {
  onMounted(() => {
    // Users who asked for less motion get the browser's own scrolling.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      touchMultiplier: 1.6,
      // Native momentum on touch beats anything we can fake.
      smoothWheel: true,
      syncTouch: false,
    });

    instance = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // In-page anchors have to go through Lenis or they jump.
    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.1 });
    };

    document.addEventListener("click", onAnchorClick);

    onBeforeUnmount(() => {
      document.removeEventListener("click", onAnchorClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
      instance = null;
    });
  });
}

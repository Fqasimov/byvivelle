"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/utils";
import { Reveal } from "./ui/reveal";
import { LanguageSwitcher } from "./language-switcher";

export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  const links = [
    { href: "#collections", label: t.nav.collections },
    { href: "#process", label: t.nav.process },
    { href: "#occasions", label: t.nav.occasions },
    { href: "#faq", label: t.faq.eyebrow },
  ];

  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-page py-20 sm:py-24">
        <Reveal className="grid gap-14 lg:grid-cols-12">
          {/* — mark ————————————————————————————————— */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <Image
                src="/media/logo.png"
                alt=""
                width={112}
                height={112}
                sizes="56px"
                className="size-14 rounded-full ring-1 ring-ink/5"
              />
              <div>
                <p className="font-display text-xl lowercase">byvivelle</p>
                <p className="mt-0.5 font-sans text-[0.625rem] tracking-[0.2em] uppercase text-ink-faint">
                  {t.footer.tagline}
                </p>
              </div>
            </div>

            <p className="mt-8 max-w-[34ch] font-serif text-[1.375rem] leading-snug italic text-ink-soft">
              {t.footer.collect}
            </p>
          </div>

          {/* — nav ——————————————————————————————————— */}
          <nav className="lg:col-span-3 lg:col-start-7">
            <p className="eyebrow">{t.footer.nav}</p>
            <ul className="mt-5 space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-[0.9375rem] text-ink-soft transition-colors duration-200 hover:text-ink"
                  >
                    <span
                      aria-hidden
                      className="h-px w-0 bg-copper transition-[width] duration-300 ease-[var(--ease-out-expo)] group-hover:w-4"
                    />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* — contact ———————————————————————————————— */}
          <div className="lg:col-span-3">
            <p className="eyebrow">{t.footer.contact}</p>
            <ul className="mt-5 space-y-3 text-[0.9375rem] text-ink-soft">
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-2 transition-colors duration-200 hover:text-ink"
                >
                  {INSTAGRAM_HANDLE}
                  <span
                    aria-hidden
                    className="transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </li>
              <li className="text-ink-muted">{t.footer.madeIn}</li>
            </ul>

            <LanguageSwitcher className="mt-7" />
          </div>
        </Reveal>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-5 border-t border-line pt-7 sm:flex-row sm:items-center">
          <p className="font-sans text-[0.75rem] text-ink-faint">
            © {year} byvivelle. {t.footer.rights}
          </p>
          <p className="font-sans text-[0.75rem] tracking-[0.14em] uppercase text-ink-faint">
            {t.footer.madeIn}
          </p>
        </div>
      </div>
    </footer>
  );
}

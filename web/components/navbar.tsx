"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Qué hacemos", href: "/que-hacemos" },
  { label: "Rendimiento & benchmark", href: "/rendimiento" },
  { label: "Informes semanales", href: "/informes-semanales" },
  { label: "Origen y filosofía", href: "/origen" },
  { label: "Contacto", href: "/contacto" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => panelRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  const activeLabel = useMemo(() => {
    const item = navItems.find((i) => isActivePath(pathname, i.href));
    return item?.label ?? "";
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-900/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center" aria-label="Ir a inicio">
          {/* ✅ Logo “pro”: controlado por ancho responsive, sin scale */}
          <div className="relative h-12 w-44 sm:w-56 lg:w-64">
            <Image
              src="/brand/logo.png"
              alt="FECEMUZ Bolsa"
              fill
              priority
              sizes="(max-width: 640px) 176px, (max-width: 1024px) 224px, 256px"
              className="object-contain object-left"
            />
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "relative whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition",
                  active
                    ? "bg-slate-900/5 text-slate-900"
                    : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900",
                ].join(" ")}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-slate-900/90" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/socios"
            className="hidden whitespace-nowrap rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 lg:inline-flex"
          >
            Área socios
          </Link>

          {/* Mobile button */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-900/10 bg-white/70 text-slate-900 transition hover:bg-white lg:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Cerrar" : "Menú"}</span>

            <div className="relative h-5 w-5">
              <span
                className={[
                  "absolute left-0 top-1 block h-0.5 w-5 rounded-full bg-slate-900 transition",
                  open ? "translate-y-1.5 rotate-45" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 top-2.5 block h-0.5 w-5 rounded-full bg-slate-900 transition",
                  open ? "opacity-0" : "opacity-100",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 top-4 block h-0.5 w-5 rounded-full bg-slate-900 transition",
                  open ? "-translate-y-2.5 -rotate-45" : "",
                ].join(" ")}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={[
          "lg:hidden",
          "fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[1px] transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile panel */}
      <div
        id="mobile-nav"
        className={[
          "lg:hidden",
          "fixed left-0 right-0 top-[57px] z-50",
          "transition duration-200",
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
        ].join(" ")}
      >
        <div className="mx-auto max-w-6xl px-4 pb-5 sm:px-6 lg:px-8">
          <div
            ref={panelRef}
            tabIndex={-1}
            className="rounded-3xl border border-slate-900/10 bg-white p-2 shadow-sm outline-none"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            <div className="px-3 pb-2 pt-2 text-xs font-semibold text-slate-500">
              Estás en: <span className="text-slate-900">{activeLabel}</span>
            </div>

            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "rounded-2xl px-3 py-2 text-sm font-semibold transition",
                      active
                        ? "bg-slate-900/5 text-slate-900"
                        : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <Link
                href="/socios"
                className="mt-1 rounded-2xl bg-slate-900 px-3 py-2 text-center text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Área socios
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
















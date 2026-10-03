"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Bookmark, ChevronRight, Compass, Film, Flame, Menu, Search, Sparkles, Star, X, CalendarDays, AudioLines } from "lucide-react";
import { GenreType } from "@/types/global";
import { WatchlistCount } from "@/components/watchlist";

const navigation = [
  { href: "/", title: "Discover", icon: Compass },
  { href: "/browse/popular", title: "Popular", icon: Flame },
  { href: "/browse/top_rated", title: "Top rated", icon: Star },
  { href: "/browse/upcoming", title: "Coming soon", icon: CalendarDays },
];

export default function AppShell({ genres, children }: { genres: GenreType[]; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault(); searchRef.current?.focus();
      }
      if (event.key === "Escape" && open) { setOpen(false); menuRef.current?.focus(); }
      if (event.key === "Tab" && open && sidebarRef.current) {
        const links = sidebarRef.current.querySelectorAll<HTMLElement>('a[href], button');
        const first = links[0], last = links[links.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  useEffect(() => {
    if (open) sidebarRef.current?.querySelector<HTMLElement>("button")?.focus();
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 761px)");
    const onResize = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);
  const closeMenu = () => setOpen(false);
  const current = pathname.startsWith("/show/") ? "Film details" : pathname.startsWith("/people/") ? "Cast profile" : pathname.startsWith("/genre/") ? "Explore genres" : pathname === "/search" ? "Search" : pathname === "/watchlist" ? "Your watchlist" : pathname.includes("/browse/") ? "Explore movies" : "Discover";

  return <div className="app-shell">
    <a href="#main-content" className="skip-link">Skip to content</a>
    {open && <button type="button" className="menu-backdrop" onClick={closeMenu} aria-label="Close navigation" />}
    <aside id="site-navigation" ref={sidebarRef} className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="sidebar-top"><Link href="/" className="brand" onClick={closeMenu}><span className="brand-icon"><AudioLines size={23} strokeWidth={2.5} /></span><span>next<span className="brand-light">movie</span><span className="brand-period">.</span></span></Link><button type="button" className="icon-button mobile-close" onClick={() => { closeMenu(); menuRef.current?.focus(); }} aria-label="Close navigation"><X size={20} /></button></div>
      <p className="nav-label">YOUR DAILY DOSE OF CINEMA</p>
      <nav aria-label="Main navigation" className="primary-nav">
        {navigation.map(({ href, title, icon: Icon }) => <Link key={href} href={href} onClick={closeMenu} aria-current={pathname === href ? "page" : undefined} className={`nav-link ${pathname === href ? "active" : ""}`}><Icon size={19} /><span>{title}</span>{pathname === href && <span className="active-dot" />}</Link>)}
      </nav>
      <div className="sidebar-divider" />
      <p className="nav-label">YOUR COLLECTION</p>
      <Link href="/watchlist" onClick={closeMenu} className={`nav-link ${pathname === "/watchlist" ? "active" : ""}`} aria-current={pathname === "/watchlist" ? "page" : undefined}><Bookmark size={19} /><span>Watchlist</span><WatchlistCount /></Link>
      <div className="sidebar-divider" />
      <div className="genre-nav-heading"><p className="nav-label">EXPLORE GENRES</p><Film size={13} /></div>
      <nav aria-label="Movie genres" className="genre-nav">{genres.map(genre => {
        const href = `/genre/${encodeURIComponent(genre.name)}/${genre.id}`;
        const active = pathname.split("/").at(-1) === String(genre.id) && pathname.startsWith("/genre/");
        return <Link key={genre.id} href={href} onClick={closeMenu} aria-current={active ? "page" : undefined} className={active ? "genre-active" : ""}>{genre.name}<ChevronRight size={12} /></Link>;
      })}</nav>
      <div className="sidebar-bottom"><div className="sidebar-note"><Sparkles size={18} /><p>A little escape.<br /><strong>A great story.</strong></p></div><span className="powered-by">Movie data by TMDB <ArrowUpRight size={11} /></span></div>
    </aside>
    <div className="workspace" inert={open ? true : undefined}>
      <header className="topbar">
        <div className="breadcrumb"><button ref={menuRef} type="button" className="icon-button mobile-menu" onClick={() => setOpen(true)} aria-label="Open navigation" aria-expanded={open} aria-controls="site-navigation"><Menu size={21} /></button><span className="breadcrumb-home">Movies</span><ChevronRight size={13} /><span>{current}</span></div>
        <form className="search-form" action="/search" method="get" role="search"><Search size={17} /><input ref={searchRef} type="search" name="q" required maxLength={200} placeholder="Search for a movie..." aria-label="Search movies" /><kbd>⌘ K</kbd><button type="submit" className="search-submit" aria-label="Search"><ArrowUpRight size={17} /></button></form>
        <Link href="/watchlist" className="header-watchlist" aria-label="Open your watchlist"><Bookmark size={19} /></Link>
      </header>
      <main id="main-content" className="main-content">{children}</main>
      <footer className="site-footer"><Link href="/" className="footer-brand">nextmovie<span>.</span></Link><span>For the love of a good story.</span><p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p></footer>
    </div>
  </div>;
}

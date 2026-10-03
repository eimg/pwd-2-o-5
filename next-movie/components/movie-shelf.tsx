"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Flame, CalendarDays } from "lucide-react";
import MovieCard from "@/components/movie-card";
import { MovieType } from "@/types/global";

type ShelfTab = { label: string; movies: MovieType[]; href: string };

export default function MovieShelf({ title, subtitle, movies, href, ranked = false, tabs, kind = "popular" }: {
  title: string; subtitle?: string; movies: MovieType[]; href?: string; ranked?: boolean; tabs?: ShelfTab[]; kind?: "popular" | "upcoming";
}) {
  const track = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(0);
  const current = tabs?.[selected];
  const collectionHref = current?.href ?? href;
  const visibleMovies = current?.movies ?? movies;
  function scroll(direction: number) {
    track.current?.scrollBy({ left: direction * track.current.clientWidth * 0.8, behavior: "smooth" });
  }
  return <section className="movie-section">
    <div className="section-heading"><div><h2>{kind === "popular" ? <Flame size={21} className="section-icon" /> : <CalendarDays size={20} className="section-icon" />}{title}</h2>{subtitle && <p>{subtitle}</p>}</div><div className="shelf-controls">{collectionHref && <Link className="text-link" href={collectionHref}>View all <ArrowUpRight size={14} /></Link>}<div className="shelf-arrows"><button type="button" className="icon-button" aria-label={`Scroll ${title} left`} onClick={() => scroll(-1)}><ChevronLeft size={17} /></button><button type="button" className="icon-button" aria-label={`Scroll ${title} right`} onClick={() => scroll(1)}><ChevronRight size={17} /></button></div></div></div>
    {tabs && <div className="shelf-tabs" role="tablist" aria-label="Movie collections">{tabs.map((tab, index) => <button type="button" key={tab.label} id={`shelf-tab-${index}`} role="tab" tabIndex={selected === index ? 0 : -1} aria-selected={selected === index} aria-controls="collection-panel" className={selected === index ? "selected" : ""} onClick={() => { setSelected(index); track.current?.scrollTo({ left: 0 }); }} onKeyDown={event => {
      if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
        setSelected(next); document.getElementById(`shelf-tab-${next}`)?.focus(); track.current?.scrollTo({ left: 0 });
      }
    }}>{tab.label}</button>)}</div>}
    <div ref={track} className="movie-shelf" id={tabs ? "collection-panel" : undefined} role={tabs ? "tabpanel" : undefined} aria-labelledby={tabs ? `shelf-tab-${selected}` : undefined} tabIndex={tabs ? 0 : undefined}>
      {visibleMovies.map((movie, index) => <MovieCard key={movie.id} movie={movie} index={ranked ? index : undefined} />)}
      {!visibleMovies.length && <p className="muted">No films available just yet. Check back soon.</p>}
    </div>
  </section>;
}

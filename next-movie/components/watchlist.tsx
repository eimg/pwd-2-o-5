"use client";

import { useState, useSyncExternalStore } from "react";
import { Bookmark, Check } from "lucide-react";
import { MovieType } from "@/types/global";

const KEY = "next-movie-watchlist";
const EMPTY: MovieType[] = [];
let cached: MovieType[] = EMPTY;
let previousRaw: string | null | undefined;
const listeners = new Set<() => void>();

function onStorage(event: StorageEvent) {
  if (event.key === KEY || event.key === null) listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  let raw: string | null;
  try { raw = window.localStorage.getItem(KEY); } catch { return cached; }
  if (raw === previousRaw) return cached;
  previousRaw = raw;
  try {
    const data: unknown = raw ? JSON.parse(raw) : [];
    cached = Array.isArray(data) ? data.filter((item): item is MovieType =>
      item !== null && typeof item === "object" && Number.isInteger(item.id) &&
      typeof item.title === "string" && typeof item.release_date === "string" &&
      typeof item.overview === "string" && typeof item.vote_average === "number" &&
      (item.poster_path === null || typeof item.poster_path === "string") &&
      (item.backdrop_path === null || typeof item.backdrop_path === "string")
    ).map(({ id, title, release_date, overview, vote_average, poster_path, backdrop_path, genre_ids }) =>
      ({ id, title, release_date, overview, vote_average, poster_path, backdrop_path, genre_ids: Array.isArray(genre_ids) ? genre_ids.filter(id => typeof id === "number") : [] })
    ) : EMPTY;
  } catch { cached = EMPTY; }
  return cached;
}

export function useWatchlist() {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

export function SaveMovie({ movie, compact = false }: { movie: MovieType; compact?: boolean }) {
  const movies = useWatchlist();
  const saved = movies.some(item => item.id === movie.id);
  const [message, setMessage] = useState("");
  function toggle() {
    const current = getSnapshot();
    const currentlySaved = current.some(item => item.id === movie.id);
    const { id, title, release_date, overview, vote_average, poster_path, backdrop_path, genre_ids } = movie;
    const item = { id, title, release_date, overview, vote_average, poster_path, backdrop_path, genre_ids };
    const next = currentlySaved ? current.filter(item => item.id !== movie.id) : [...current, item];
    try {
      const raw = JSON.stringify(next);
      window.localStorage.setItem(KEY, raw);
      previousRaw = raw;
      setMessage(currentlySaved ? "Removed from your watchlist" : "Added to your watchlist");
    } catch {
      setMessage("Saved for this session. Browser storage is unavailable.");
    }
    cached = next;
    listeners.forEach(listener => listener());
  }
  return <>
    <button type="button" onClick={toggle} aria-pressed={saved}
      aria-label={`${saved ? "Remove" : "Save"} ${movie.title} ${saved ? "from" : "to"} watchlist`}
      className={compact ? `save-button ${saved ? "is-saved" : ""}` : `button button-secondary ${saved ? "is-saved" : ""}`}>
      {saved ? <Check size={17} /> : <Bookmark size={17} />}
      {!compact && (saved ? "In your watchlist" : "Watchlist")}
    </button>
    <span className="sr-only" role="status">{message}</span>
  </>;
}

export function WatchlistCount() {
  const movies = useWatchlist();
  return movies.length > 0 ? <span className="nav-count">{movies.length}</span> : null;
}

"use client";

import Link from "next/link";
import { ArrowUpRight, Bookmark } from "lucide-react";
import MovieCard from "@/components/movie-card";
import { useWatchlist } from "@/components/watchlist";

export function WatchlistContent() {
  const movies = useWatchlist();
  return movies.length > 0 ? <>
    <div className="results-summary">{movies.length} {movies.length === 1 ? "film" : "films"} to look forward to <span>Saved on this device</span></div>
    <div className="movie-grid">{movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}</div>
  </> : <div className="empty-state">
    <div className="empty-icon"><Bookmark size={30} /></div>
    <h2>Your next movie night, on standby.</h2>
    <p>Save the films that catch your eye. They’ll be waiting for you here.</p>
    <Link href="/" className="button button-primary">Find your next film <ArrowUpRight size={18} /></Link>
  </div>;
}

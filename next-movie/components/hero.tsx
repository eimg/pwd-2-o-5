"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { GenreType, MovieType } from "@/types/global";
import { imageUrl, movieYear, rating } from "@/lib/movie-utils";
import { SaveMovie } from "@/components/watchlist";

export default function Hero({ movies, genres }: { movies: MovieType[]; genres: GenreType[] }) {
  const [active, setActive] = useState(0);
  const movie = movies[active];
  if (!movie) return null;
  const movieGenres = genres.filter(genre => movie.genre_ids?.includes(genre.id)).slice(0, 3);
  return <section className="hero" aria-label="Featured films" aria-roledescription="carousel">
    {movie.backdrop_path && <Image key={movie.id} src={imageUrl(movie.backdrop_path, "w1280")} alt={`Scene from ${movie.title}`} fill sizes="(max-width: 800px) 100vw, 80vw" preload={active === 0} className="hero-image" />}
    <div className="hero-gradient" />
    <div className="hero-topline"><span className="spotlight-tag"><span /> IN THE SPOTLIGHT</span><span className="hero-feature">FEATURED FILM / {String(active + 1).padStart(2, "0")}</span></div>
    <div className="hero-content" key={`content-${movie.id}`}>
      <div className="hero-genres">{movieGenres.map(genre => <span key={genre.id}>{genre.name}</span>)}</div>
      <h2>{movie.title}</h2>
      <div className="hero-meta"><span className="hero-rating"><Star size={14} fill="currentColor" /> {rating(movie.vote_average)} <span>TMDB</span></span><span className="meta-dot" /><span>{movieYear(movie.release_date)}</span><span className="meta-dot" /><span>Movie</span></div>
      <p className="hero-overview">{movie.overview || "A new story is waiting to be discovered."}</p>
      <div className="hero-actions"><Link href={`/show/${movie.id}`} className="button button-primary">Explore movie <ArrowUpRight size={18} /></Link><SaveMovie movie={movie} /></div>
    </div>
    {movies.length > 1 && <div className="hero-pagination"><div className="hero-dots">{movies.map((film, index) => <button key={film.id} type="button" onClick={() => setActive(index)} className={active === index ? "selected" : ""} aria-label={`Feature ${film.title}`} aria-pressed={active === index} />)}</div><div className="hero-arrows"><button type="button" aria-label="Previous featured film" onClick={() => setActive((active + movies.length - 1) % movies.length)}><ChevronLeft size={18} /></button><button type="button" aria-label="Next featured film" onClick={() => setActive((active + 1) % movies.length)}><ChevronRight size={18} /></button></div></div>}
  </section>;
}

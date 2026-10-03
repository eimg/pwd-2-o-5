import Link from "next/link";
import { ArrowUpRight, Compass } from "lucide-react";
import Hero from "@/components/hero";
import MovieShelf from "@/components/movie-shelf";
import { getGenres, MovieResults, tmdb } from "@/lib/tmdb";

export default async function Home() {
  const [popular, upcoming, topRated, genres] = await Promise.all([
    tmdb<MovieResults>("movie/popular?language=en-US"),
    tmdb<MovieResults>("movie/upcoming?language=en-US"),
    tmdb<MovieResults>("movie/top_rated?language=en-US"),
    getGenres(),
  ]);
  const featured = popular.results.filter(movie => movie.backdrop_path).slice(0, 3);
  const genrePicks = [{ id: 28, label: "A little adrenaline", name: "Action", symbol: "↗" }, { id: 35, label: "A reason to smile", name: "Comedy", symbol: "☺" }, { id: 878, label: "Beyond the ordinary", name: "Science Fiction", symbol: "✳" }, { id: 18, label: "All the feelings", name: "Drama", symbol: "◈" }];
  return <>
    <div className="page-heading"><div><p className="eyebrow">THE WORLD LOOKS BETTER IN WIDESCREEN</p><h1>Find your next <span>great watch.</span></h1><p>Big adventures. Small discoveries. Stories worth your time.</p></div><span className="discovery-note"><span className="live-dot" /> A world of cinema, updated daily</span></div>
    <Hero movies={featured} genres={genres} />
    <MovieShelf title="Worth the hype" subtitle="The films making a little noise right now." movies={popular.results} href="/browse/popular" ranked tabs={[{ label: "Popular now", movies: popular.results, href: "/browse/popular" }, { label: "Top rated", movies: topRated.results, href: "/browse/top_rated" }, { label: "Coming soon", movies: upcoming.results, href: "/browse/upcoming" }]} />
    <section className="genre-section"><div className="section-heading"><div><h2><Compass size={21} className="section-icon" />What’s your mood?</h2><p>There’s a story for every kind of night.</p></div><span className="genre-section-note">FOLLOW YOUR CURIOSITY</span></div><div className="mood-grid">{genrePicks.map(genre => <Link key={genre.id} href={`/genre/${encodeURIComponent(genre.name)}/${genre.id}`} className={`mood-card mood-${genre.id}`}><span className="mood-symbol" aria-hidden="true">{genre.symbol}</span><span className="mood-copy"><small>{genre.label}</small><strong>{genre.name === "Science Fiction" ? "Sci-fi" : genre.name}</strong></span><ArrowUpRight size={19} /></Link>)}</div></section>
    <MovieShelf title="On the horizon" subtitle="Make room on your watchlist. Good things are coming." movies={upcoming.results} href="/browse/upcoming" kind="upcoming" />
    <div className="watchlist-banner"><div><span className="eyebrow">GOOD TASTE DESERVES A GOOD LIST</span><h2>Your kind of cinema.<br />Your own little collection.</h2><p>Keep all your “I need to watch that” moments in one place.</p></div><Link href="/watchlist" className="button button-primary">Your watchlist <ArrowUpRight size={18} /></Link><span className="banner-art" aria-hidden="true">✳</span></div>
  </>;
}

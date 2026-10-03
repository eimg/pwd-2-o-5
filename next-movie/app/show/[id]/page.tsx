import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock, Film, Play, Star, UserRound } from "lucide-react";
import { MovieDetails, MovieServiceError, tmdb } from "@/lib/tmdb";
import { imageUrl, movieYear, rating } from "@/lib/movie-utils";
import { SaveMovie } from "@/components/watchlist";
import MovieShelf from "@/components/movie-shelf";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return { title: "Film not found" };
  const movie = await tmdb<MovieDetails>(`movie/${id}?append_to_response=credits,videos,recommendations&language=en-US`).catch(() => null);
  return movie ? { title: movie.title, description: movie.overview.slice(0, 160) } : { title: "Film details" };
}

export default async function ShowMovie({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const movie = await tmdb<MovieDetails>(`movie/${id}?append_to_response=credits,videos,recommendations&language=en-US`).catch(error => {
    if (error instanceof MovieServiceError && error.status === 404) notFound();
    throw error;
  });
  const trailer = movie.videos.results.find(video => video.site === "YouTube" && video.type === "Trailer" && video.official) ?? movie.videos.results.find(video => video.site === "YouTube" && video.type === "Trailer");
  const director = movie.credits.crew.filter(person => person.job === "Director").map(person => person.name).join(", ");
  return <>
    <Link href="/" className="back-link"><ArrowLeft size={16} /> Back to discover</Link>
    <section className="detail-hero">
      {movie.backdrop_path && <Image src={imageUrl(movie.backdrop_path, "w1280")} alt={`Scene from ${movie.title}`} fill sizes="(max-width: 800px) 100vw, 80vw" preload className="detail-backdrop" />}
      <div className="detail-gradient" />
      <div className="detail-hero-content"><div className="detail-poster">{movie.poster_path ? <Image src={imageUrl(movie.poster_path)} alt={`${movie.title} poster`} fill sizes="(max-width: 600px) 130px, 220px" /> : <Film size={40} />}</div><div className="detail-copy"><p className="eyebrow">GET LOST IN A GOOD STORY</p><div className="hero-genres">{movie.genres?.map(genre => <Link key={genre.id} href={`/genre/${encodeURIComponent(genre.name)}/${genre.id}`}>{genre.name}</Link>)}</div><h1>{movie.title}</h1>{movie.tagline && <p className="detail-tagline">{movie.tagline}</p>}<div className="hero-meta"><span className="hero-rating"><Star size={15} fill="currentColor" /> {rating(movie.vote_average)} <span>TMDB</span></span><span className="meta-dot" /><span>{movieYear(movie.release_date)}</span>{!!movie.runtime && <><span className="meta-dot" /><span><Clock size={14} /> {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span></>}</div><div className="hero-actions">{trailer && <a className="button button-primary" href={`https://www.youtube.com/watch?v=${encodeURIComponent(trailer.key)}`} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${movie.title} trailer on YouTube (opens a new tab)`}><Play size={16} fill="currentColor" /> Watch trailer <ArrowUpRight size={15} /></a>}<SaveMovie movie={movie} /></div></div></div>
    </section>
    <section className="story-section"><div><p className="eyebrow">THE STORY</p><h2>Here’s where it begins.</h2><p className="overview-text">{movie.overview || "The story is still under wraps. Check back for more details."}</p></div><dl className="film-facts">{director && <div><dt>DIRECTED BY</dt><dd>{director}</dd></div>}<div><dt>RELEASE DATE</dt><dd>{movie.release_date ? new Date(`${movie.release_date}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }) : "To be announced"}</dd></div>{movie.original_language && <div><dt>ORIGINAL LANGUAGE</dt><dd>{new Intl.DisplayNames(["en"], { type: "language" }).of(movie.original_language)}</dd></div>}</dl></section>
    {movie.credits.cast.length > 0 && <section className="cast-section"><div className="section-heading"><div><h2>The faces behind the story</h2><p>A little star power goes a long way.</p></div><span className="genre-section-note">CAST & CHARACTERS</span></div><div className="cast-grid">{movie.credits.cast.slice(0, 12).map(person => <Link className="cast-card" key={person.id} href={`/people/${person.id}`}><div className="cast-image">{person.profile_path ? <Image src={imageUrl(person.profile_path, "w185")} alt={person.name} fill sizes="(max-width: 600px) 30vw, 130px" /> : <UserRound size={32} />}</div><h3>{person.name}</h3><p>{person.character}</p></Link>)}</div></section>}
    {movie.recommendations.results.length > 0 && <MovieShelf title="Keep the good stories going" subtitle="A few more films you might fall for." movies={movie.recommendations.results} />}
  </>;
}

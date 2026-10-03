import { MovieType } from "@/types/global";
import Link from "next/link";
import Image from "next/image";
import { Film, Star } from "lucide-react";
import { SaveMovie } from "@/components/watchlist";
import { imageUrl, movieYear, rating } from "@/lib/movie-utils";

export default function MovieCard({ movie, index }: { movie: MovieType; index?: number }) {
  return <article className="movie-card">
    <div className="poster-wrap">
      <Link href={`/show/${movie.id}`} className="poster-link" aria-label={`Explore ${movie.title}`}>
        {movie.poster_path ? <Image src={imageUrl(movie.poster_path)} alt={`${movie.title} poster`} fill sizes="(max-width: 600px) 45vw, (max-width: 1100px) 25vw, 16vw" /> : <div className="image-placeholder"><Film size={36} /><span>Artwork coming soon</span></div>}
        <span className="poster-shade" />
        {index !== undefined && <span className="movie-number">{String(index + 1).padStart(2, "0")}</span>}
        <span className="rating-badge"><Star size={11} fill="currentColor" /> {rating(movie.vote_average)}</span>
      </Link>
      <SaveMovie movie={movie} compact />
    </div>
    <Link href={`/show/${movie.id}`} className="movie-title">{movie.title}</Link>
    <div className="movie-meta"><span>{movieYear(movie.release_date)}</span><span className="meta-dot" /><span>Movie</span></div>
  </article>;
}

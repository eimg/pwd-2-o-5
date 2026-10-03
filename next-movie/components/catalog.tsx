import Link from "next/link";
import { ArrowLeft, ArrowRight, SearchX } from "lucide-react";
import MovieCard from "@/components/movie-card";
import { MovieResults } from "@/lib/tmdb";

export default function Catalog({ data, href, emptyText = "Try another genre or explore what's popular right now." }: { data: MovieResults; href: string; emptyText?: string }) {
  const maxPages = Math.min(data.total_pages, 500);
  const separator = href.includes("?") ? "&" : "?";
  return <>
    <div className="results-summary"><span>{data.total_results.toLocaleString("en-US")} films to explore</span>{maxPages > 0 && <span>Page {data.page} of {maxPages}</span>}</div>
    {data.results.length ? <div className="movie-grid">{data.results.map(movie => <MovieCard key={movie.id} movie={movie} />)}</div> : <div className="empty-state"><div className="empty-icon"><SearchX size={30} /></div><h2>No films found this time.</h2><p>{emptyText}</p><Link href="/" className="button button-primary">Back to discover <ArrowRight size={17} /></Link></div>}
    {maxPages > 1 && <nav className="pagination" aria-label="Result pages">{data.page > 1 ? <Link href={`${href}${separator}page=${data.page - 1}`} className="button button-secondary"><ArrowLeft size={16} /> Previous</Link> : <span />}<span>{String(data.page).padStart(2, "0")} <span className="muted">/ {maxPages}</span></span>{data.page < maxPages ? <Link href={`${href}${separator}page=${data.page + 1}`} className="button button-secondary">Next page <ArrowRight size={16} /></Link> : <span />}</nav>}
  </>;
}

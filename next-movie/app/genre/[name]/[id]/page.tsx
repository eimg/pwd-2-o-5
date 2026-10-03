import { notFound } from "next/navigation";
import Link from "next/link";
import Catalog from "@/components/catalog";
import { getGenres, MovieResults, pageNumber, tmdb } from "@/lib/tmdb";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const genres = await getGenres();
  return { title: genres.find(genre => String(genre.id) === id)?.name ?? "Explore genres" };
}

export default async function Genre({ params, searchParams }: { params: Promise<{ name: string; id: string }>; searchParams: Promise<{ page?: string }> }) {
  const { id } = await params;
  const genres = await getGenres();
  const genre = genres.find(item => String(item.id) === id);
  if (!genre) notFound();
  const page = pageNumber((await searchParams).page);
  const data = await tmdb<MovieResults>(`discover/movie?with_genres=${id}&language=en-US&page=${page}`);
  return <><div className="page-heading catalog-heading"><div><p className="eyebrow">A DIFFERENT KIND OF ESCAPE</p><h1>A world of <span>{genre.name.toLowerCase()}.</span></h1><p>Lose yourself in the stories you love. Find a few new favorites along the way.</p></div></div><nav className="genre-chips" aria-label="Browse genres">{genres.map(item => <Link key={item.id} href={`/genre/${encodeURIComponent(item.name)}/${item.id}`} aria-current={item.id === genre.id ? "page" : undefined} className={item.id === genre.id ? "selected" : ""}>{item.name}</Link>)}</nav><Catalog data={data} href={`/genre/${encodeURIComponent(genre.name)}/${genre.id}`} /></>;
}

import Catalog from "@/components/catalog";
import { MovieResults, pageNumber, tmdb } from "@/lib/tmdb";

export const metadata = { title: "Search movies" };

export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string | string[]; page?: string }> }) {
  const params = await searchParams;
  const q = (Array.isArray(params.q) ? params.q[0] : params.q ?? "").trim().slice(0, 200);
  const page = pageNumber(params.page);
  const data = q ? await tmdb<MovieResults>(`search/movie?query=${encodeURIComponent(q)}&language=en-US&page=${page}`) : { results: [], page: 1, total_pages: 0, total_results: 0 };
  return <><div className="page-heading catalog-heading"><div><p className="eyebrow">FOLLOW THAT THREAD</p><h1>{q ? <>Results for <span>“{q}”</span></> : "Every great story starts somewhere."}</h1><p>{q ? "A familiar favorite or something completely new. Your next watch could be here." : "Search for a title using the search bar above."}</p></div></div><Catalog data={data} href={`/search?q=${encodeURIComponent(q)}`} emptyText={q ? "Try a different title or check your spelling. There's a whole world of cinema waiting." : "Enter a movie title in the search bar to get started."} /></>;
}

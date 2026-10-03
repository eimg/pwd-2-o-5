import { notFound } from "next/navigation";
import Catalog from "@/components/catalog";
import { Collection, collections, MovieResults, pageNumber, tmdb } from "@/lib/tmdb";

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  return { title: Object.hasOwn(collections, collection) ? collections[collection as Collection].title : "Explore movies" };
}

export default async function Browse({ params, searchParams }: { params: Promise<{ collection: string }>; searchParams: Promise<{ page?: string }> }) {
  const { collection } = await params;
  if (!Object.hasOwn(collections, collection)) notFound();
  const info = collections[collection as Collection];
  const page = pageNumber((await searchParams).page);
  const data = await tmdb<MovieResults>(`${info.endpoint}?language=en-US&page=${page}`);
  return <><div className="page-heading catalog-heading"><div><p className="eyebrow">{info.eyebrow}</p><h1>{info.title}<span className="accent-period">.</span></h1><p>{info.description}</p></div></div><Catalog data={data} href={`/browse/${collection}`} /></>;
}

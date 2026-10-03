import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, UserRound } from "lucide-react";
import { MovieServiceError, tmdb } from "@/lib/tmdb";
import { MovieType } from "@/types/global";
import { imageUrl } from "@/lib/movie-utils";
import MovieCard from "@/components/movie-card";

type PersonDetails = { id: number; name: string; profile_path: string | null; biography: string; known_for_department: string; place_of_birth: string | null; movie_credits: { cast: MovieType[] } };

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return { title: "Profile not found" };
  const person = await tmdb<PersonDetails>(`person/${id}?append_to_response=movie_credits&language=en-US`).catch(() => null);
  return { title: person?.name ?? "Cast profile" };
}

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const person = await tmdb<PersonDetails>(`person/${id}?append_to_response=movie_credits&language=en-US`).catch(error => {
    if (error instanceof MovieServiceError && error.status === 404) notFound();
    throw error;
  });
  const films = [...new Map(person.movie_credits.cast.filter(movie => movie.poster_path).map(movie => [movie.id, movie])).values()].sort((a, b) => (b.release_date || "").localeCompare(a.release_date || ""));
  return <><Link href="/" className="back-link"><ArrowLeft size={16} /> Back to discover</Link><section className="person-profile"><div className="person-image">{person.profile_path ? <Image src={imageUrl(person.profile_path)} alt={person.name} fill sizes="(max-width: 600px) 150px, 240px" preload /> : <UserRound size={48} />}</div><div><p className="eyebrow">THE PEOPLE WHO MAKE THE MAGIC</p><h1>{person.name}</h1><div className="person-meta">{person.known_for_department}{person.place_of_birth && ` · ${person.place_of_birth}`}</div><p className="person-biography">{person.biography || "There isn't a biography available yet. Explore their films below."}</p></div></section><div className="section-heading"><div><h2>A life in films</h2><p>{films.length} stories to explore.</p></div></div><div className="movie-grid">{films.map(movie => <MovieCard key={movie.id} movie={movie} />)}</div></>;
}

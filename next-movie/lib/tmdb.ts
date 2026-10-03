import "server-only";
import { GenreType, MovieType, PersonType } from "@/types/global";

export class MovieServiceError extends Error {
  constructor(public status: number) {
    super(`Movie service returned ${status}`);
  }
}

export async function tmdb<T>(path: string): Promise<T> {
  const response = await fetch(`https://api.themoviedb.org/3/${path}`, {
    headers: { Authorization: `Bearer ${process.env.TMDB_TOKEN}` },
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new MovieServiceError(response.status);
  return response.json();
}

export type MovieResults = { results: MovieType[]; total_results: number; total_pages: number; page: number };
export type Video = { key: string; name: string; site: string; type: string; official?: boolean };
export type MovieDetails = MovieType & {
  credits: { cast: PersonType[]; crew: { name: string; job: string }[] };
  videos: { results: Video[] };
  recommendations: MovieResults;
};

export async function getGenres() {
  const data = await tmdb<{ genres: GenreType[] }>("genre/movie/list?language=en-US");
  return data.genres;
}

export const collections = {
  popular: { title: "Popular right now", eyebrow: "THE CONVERSATION STARTERS", description: "The films everyone's talking about. Find out what all the excitement is about.", endpoint: "movie/popular" },
  top_rated: { title: "The unforgettable ones", eyebrow: "TOP RATED", description: "Extraordinary stories that stay with you long after the credits roll.", endpoint: "movie/top_rated" },
  upcoming: { title: "Something to look forward to", eyebrow: "COMING SOON", description: "Your next movie night starts here. Discover what's on the horizon.", endpoint: "movie/upcoming" },
} as const;
export type Collection = keyof typeof collections;

export function pageNumber(value?: string | string[]) {
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, 500) : 1;
}

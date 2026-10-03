export type GenreType = {
    id: number;
    name: string
}

export type MovieType = {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    genre_ids?: number[];
    genres?: GenreType[];
    runtime?: number;
    tagline?: string;
    original_language?: string;
}

export type PersonType = {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

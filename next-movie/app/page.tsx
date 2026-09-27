import MovieCard from "@/components/movie-card";
import { MovieType } from "@/types/global";

async function fetchUpcoming(): Promise<MovieType[]> {
    const res = await fetch("https://api.themoviedb.org/3/movie/upcoming", {
        headers: {
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        },
    });

    const data = await res.json();
    return data.results;
}

async function fetchPopular(): Promise<MovieType[]> {
	const res = await fetch("https://api.themoviedb.org/3/movie/popular", {
		headers: {
			Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
		},
	});

	const data = await res.json();
	return data.results;
}

export default async function Home() {
    const upcoming = await fetchUpcoming();
    const popular = await fetchPopular();

    return (
		<div>
			<h2 className="text-lg pb-4 mb-4 border-b font-bold">Upcoming</h2>
			<div className="flex gap-2 flex-wrap">
				{upcoming?.map(movie => {
					return (
						<MovieCard key={movie.id} movie={movie} />
					);
				})}
			</div>

			<h2 className="text-lg mt-8 pb-4 mb-4 border-b font-bold">Popular</h2>
			<div className="flex gap-2 flex-wrap">
				{popular?.map(movie => {
					return (
						<MovieCard key={movie.id} movie={movie} />
					);
				})}
			</div>
		</div>
	);
}

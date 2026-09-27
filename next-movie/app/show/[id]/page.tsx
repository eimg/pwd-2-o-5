import { MovieType } from "@/types/global";

async function fetchMovie(id: string): Promise<MovieType> {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
		headers: {
			Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
		},
	});

    return await res.json();
}

const backdrop = "http://image.tmdb.org/t/p/w1280";

export default async function ShowMovie({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
    const movie = await fetchMovie(id);

	return (
		<div>
			<h2 className="text-lg pb-4 mb-4 border-b font-bold">
                {movie.title} ({movie.release_date.split("-")[0]})
            </h2>
            <img src={backdrop + movie.backdrop_path} />
            <p className="mt-4">
                {movie.overview}
            </p>
		</div>
	);
}

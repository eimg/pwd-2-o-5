import { MovieType } from "@/types/global";
import Link from "next/link";

const poster = "http://image.tmdb.org/t/p/w185";

export default function MovieCard({ movie }: { movie: MovieType }) {
	return (
		<div className="w-46 text-center mb-4">
			<Link href={`/show/${movie.id}`}>
				<img
					src={poster + movie.poster_path}
					alt=""
					className="hover:scale-105 transition-all"
				/>
			</Link>
			<h3 className="mt-1 font-bold">{movie.title}</h3>
			<div>{movie.release_date.split("-")[0]}</div>
		</div>
	);
}

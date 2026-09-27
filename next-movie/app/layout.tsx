import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import { Clapperboard, Search, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GenreType } from "@/types/global";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Next Movie App",
	description: "Powered by TMDB API",
};

async function fetchGenres(): Promise<GenreType[]> {
	const res = await fetch("https://api.themoviedb.org/3/genre/movie/list", {
        headers: {
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        }
    });

	const data = await res.json();
	return data.genres;
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
	const genres = await fetchGenres();

	return (
		<html
			lang="en"
			className={cn(
				"h-full",
				"antialiased",
				geistSans.variable,
				geistMono.variable,
				"font-sans",
				inter.variable,
			)}>
			<body className="min-h-full flex flex-col">
				<header className="p-8 border-b flex items-center justify-between">
					<h1 className="font-bold text-xl flex gap-4 items-center">
						<Clapperboard />
						Next Movie
					</h1>

					<form className="flex gap-1 items-center">
						<Input placeholder="Search" />
						<Button>
							<Search />
						</Button>
					</form>
				</header>
				<main className="flex">
					<aside className="p-4 border-r flex flex-col gap-1 min-w-56">
						<Button
							variant="outline"
							className="justify-start py-4">
							<Link
								href={"/"}
								className="flex gap-2 justify-center items-center">
								<Play />
								All Genres
							</Link>
						</Button>
						{genres?.map(genre => {
							return (
								<Button
									key={genre.id}
									variant="outline"
									className="justify-start py-4">
									<Link
										href={"/"}
										className="flex gap-2 justify-center items-center">
										<Play />
										{genre.name}
									</Link>
								</Button>
							);
						})}
					</aside>
					<div className="p-4">{children}</div>
				</main>
			</body>
		</html>
	);
}

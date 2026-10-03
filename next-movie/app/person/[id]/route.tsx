import { PersonType } from "@/types/global";
import type { NextRequest } from "next/server";

async function fetchPerson(id: string): Promise<PersonType[]> {
    const res = await fetch(`https://api.themoviedb.org/3/person/${id}`, {
		headers: {
			Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
		},
	});

    return await res.json();
}

export async function GET(_req: NextRequest, ctx: RouteContext<"/person/[id]">) {
	const { id } = await ctx.params;
    const person = await fetchPerson(id);

	return Response.json(person);
}

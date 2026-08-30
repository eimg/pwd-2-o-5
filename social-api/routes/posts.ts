import express from "express";
export const router = express.Router();

import { prisma } from "../lib/prisma";

router.get("/posts", async (req, res) => {
	const posts = await prisma.post.findMany({
		orderBy: {
			id: "desc",
		},
		take: 20,
		include: {
			user: true,
			comments: true,
		},
	});

	res.json(posts);
});

router.get("/posts/:id", async (req, res) => {
	const id = req.params?.id;

	const post = await prisma.post.findFirst({
		where: { id: Number(id) },
		include: {
			user: true,
			comments: {
				include: {
					user: true,
				},
			},
		},
	});

	res.json(post);
});

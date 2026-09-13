import express from "express";
export const router = express.Router();

import { prisma } from "../lib/prisma";

import { auth } from "../middlewares/auth";

router.get("/posts", async (req, res) => {
	const posts = await prisma.post.findMany({
		orderBy: {
			id: "desc",
		},
		take: 20,
		include: {
			user: true,
			comments: true,
			likes: true,
		},
	});

	res.json(posts);
});

router.post("/posts", auth, async (req, res) => {
	const content = req.body?.content?.trim();
	if (!content) {
		return res.status(400).json({ msg: "content is required" });
	}

	const userId = res.locals.user.id as number;
	const post = await prisma.post.create({
		data: {
			content,
			userId,
		},
	});

	res.status(201).json(post);
});

router.delete("/posts/:id", auth, async (req, res) => {
	const id = Number(req.params.id);
	const userId = res.locals.user.id as number;

	if (!Number.isInteger(id)) {
		return res.status(400).json({ msg: "invalid post id" });
	}

	const post = await prisma.post.findFirst({
		where: { id, userId },
	});
	if (!post) {
		return res.status(404).json({ msg: "post not found" });
	}

	await prisma.$transaction([
		prisma.notification.deleteMany({ where: { postId: id } }),
		prisma.comment.deleteMany({ where: { postId: id } }),
		prisma.like.deleteMany({ where: { postId: id } }),
		prisma.post.delete({ where: { id } }),
	]);

	res.status(204).send();
});

router.get("/posts/:id", async (req, res) => {
	const id = Number(req.params?.id);
	if (!Number.isInteger(id)) {
		return res.status(400).json({ msg: "invalid post id" });
	}

	const post = await prisma.post.findFirst({
		where: { id },
		include: {
			user: true,
			comments: {
				include: {
					user: true,
				},
			},
			likes: true,
		},
	});

	if (!post) {
		return res.status(404).json({ msg: "post not found" });
	}

	res.json(post);
});

router.post("/posts/:id/comments", auth, async (req, res) => {
	const postId = Number(req.params.id);
	const content = req.body?.content?.trim();

	if (!Number.isInteger(postId)) {
		return res.status(400).json({ msg: "invalid post id" });
	}
	if (!content) {
		return res.status(400).json({ msg: "content is required" });
	}

	const post = await prisma.post.findUnique({ where: { id: postId } });
	if (!post) {
		return res.status(404).json({ msg: "post not found" });
	}

	const userId = res.locals.user.id as number;
	const comment = await prisma.$transaction(async transaction => {
		const createdComment = await transaction.comment.create({
			data: { content, postId, userId },
			include: { user: true },
		});

		if (post.userId !== userId) {
			await transaction.notification.create({
				data: {
					type: "COMMENT",
					recipientId: post.userId,
					actorId: userId,
					postId,
					commentId: createdComment.id,
				},
			});
		}

		return createdComment;
	});

	res.status(201).json(comment);
});

router.post("/posts/:id/like", auth, async (req, res) => {
	const postId = Number(req.params.id);
	const userId = res.locals.user.id as number;

	if (!Number.isInteger(postId)) {
		return res.status(400).json({ msg: "invalid post id" });
	}

	const post = await prisma.post.findUnique({ where: { id: postId } });
	if (!post) {
		return res.status(404).json({ msg: "post not found" });
	}

	const existingLike = await prisma.like.findUnique({
		where: { userId_postId: { userId, postId } },
	});
	if (existingLike) {
		return res.json(existingLike);
	}

	const like = await prisma.$transaction(async transaction => {
		const createdLike = await transaction.like.create({
			data: { userId, postId },
		});

		if (post.userId !== userId) {
			await transaction.notification.create({
				data: {
					type: "LIKE",
					recipientId: post.userId,
					actorId: userId,
					postId,
				},
			});
		}

		return createdLike;
	});

	res.status(201).json(like);
});

router.delete("/posts/:id/like", auth, async (req, res) => {
	const postId = Number(req.params.id);
	const userId = res.locals.user.id as number;

	if (!Number.isInteger(postId)) {
		return res.status(400).json({ msg: "invalid post id" });
	}

	await prisma.like.deleteMany({ where: { userId, postId } });
	res.status(204).send();
});

router.delete("/comments/:id", auth, async (req, res) => {
	const id = Number(req.params.id);
	const userId = res.locals.user.id as number;

	if (!Number.isInteger(id)) {
		return res.status(400).json({ msg: "invalid comment id" });
	}

	const comment = await prisma.comment.findFirst({
		where: { id, userId },
	});
	if (!comment) {
		return res.status(404).json({ msg: "comment not found" });
	}

	await prisma.$transaction([
		prisma.notification.deleteMany({ where: { commentId: id } }),
		prisma.comment.delete({ where: { id } }),
	]);
	res.status(204).send();
});

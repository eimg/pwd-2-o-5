import express from "express";
export const router = express.Router();

import { prisma } from "../lib/prisma";
import { auth } from "../middlewares/auth";

router.get("/notifications", auth, async (req, res) => {
	const recipientId = res.locals.user.id as number;
	const [notifications, unreadCount] = await Promise.all([
		prisma.notification.findMany({
			where: { recipientId },
			orderBy: { created: "desc" },
			take: 50,
			include: {
				actor: { select: { id: true, name: true, username: true } },
				post: { select: { id: true, content: true } },
			},
		}),
		prisma.notification.count({ where: { recipientId, read: false } }),
	]);

	res.json({ notifications, unreadCount });
});

router.patch("/notifications/read", auth, async (req, res) => {
	const recipientId = res.locals.user.id as number;
	await prisma.notification.updateMany({
		where: { recipientId, read: false },
		data: { read: true },
	});

	res.status(204).send();
});

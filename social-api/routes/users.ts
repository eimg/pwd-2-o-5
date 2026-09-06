import express from "express";
export const router = express.Router();

import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

import jwt from "jsonwebtoken";

import { auth } from "../middlewares/auth";

router.get("/verify", auth, async (req, res) => {
    const id = res.locals.user.id;
    const user = await prisma.user.findFirst({
        where: { id },
    });

    res.json(user);
});

router.get("/users", auth, async (req, res) => {
	const users = await prisma.user.findMany({
		take: 20,
	});

	res.json(users);
});

router.post("/login", async (req, res) => {
	const username = req.body?.username;
	const password = req.body?.password;

	if (!username || !password) {
		return res
			.status(400)
			.json({ msg: "username and password are required" });
	}

	const user = await prisma.user.findFirst({
		where: { username },
	});

	if (user) {
		if (await bcrypt.compare(password, user.password)) {
			const token = jwt.sign(
				{ id: user.id },
				process.env.JWT_TOKEN as string,
			);

			return res.json({
				user,
				token,
			});
		}
	}

    res.status(401).json({ msg: "username or password incorrect" });
});

router.post("/users", async (req, res) => {
	const name = req.body?.name;
	const username = req.body?.username;
	const bio = req.body?.bio;
	const password = req.body?.password;

	if (!name || !username || !password) {
		return res
			.status(400)
			.json({ msg: "name, username and password are required" });
	}

	try {
		const user = await prisma.user.create({
			data: {
				name,
				username,
				bio,
				password: await bcrypt.hash(password, 10),
			},
		});

		res.status(201).json(user);
	} catch (e) {
		res.status(500).json(e);
	}
});

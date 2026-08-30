import express from "express";
export const router = express.Router();

import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

router.get("/users", async (req, res) => {
	const users = await prisma.user.findMany({
		take: 20,
	});

	res.json(users);
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

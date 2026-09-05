import express from "express";
import jwt from "jsonwebtoken";

export async function auth(
	req: express.Request,
	res: express.Response,
	next: express.NextFunction,
) {
	const authorization = req.headers?.authorization;
	const token = authorization?.split(" ")[1];

	if (token) {
		try {
			const user = jwt.verify(token, process.env.JWT_TOKEN as string);
			if (user) {
				res.locals.user = user;
				return next();
			}

            return res.status(401).json({ msg: "invalid token" });
		} catch (e) {
			return res.status(401).json({ msg: "invalid token" });
		}
	}

	res.status(401).json({ msg: "token required" });
}

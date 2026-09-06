import express from "express";
const app = express();

import cors from "cors";
app.use(cors());

app.use(express.urlencoded());
app.use(express.json());

import { router as postsRouter } from "./routes/posts";
app.use(postsRouter);

import { router as usersRouter } from "./routes/users";
app.use(usersRouter);

app.get("/", (req, res) => {
	res.json({ app: "Social API", status: "live" });
});

app.listen(8800, () => {
	console.log("Social API running at 8800...");
});

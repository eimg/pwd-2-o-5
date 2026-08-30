import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

async function seedUsers() {
	console.log("User seeding started...");

	await prisma.user.createMany({
		data: [
			{
				name: "Alice",
				username: "alice",
				bio: "First user",
				password: await bcrypt.hash("password", 10),
			},
			{
				name: "Bob",
				username: "bob",
				bio: "Second user",
				password: await bcrypt.hash("password", 10),
			},
		],
	});

	for (let i = 0; i < 5; i++) {
		const hash = await bcrypt.hash("password", 10);
		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName();
		const username = firstName.toLowerCase() + lastName.toLowerCase()[0];

		await prisma.user.create({
			data: {
				name: `${firstName} ${lastName}`,
				username,
				bio: faker.person.bio(),
				password: hash,
			},
		});
	}

	console.log("User seeding Done. \n");
}

async function seedPosts() {
	console.log("Post seeding started...");

	for (let i = 0; i < 20; i++) {
		await prisma.post.create({
			data: {
				content: faker.lorem.paragraph(),
				userId: faker.number.int({ min: 1, max: 7 }),
			},
		});
	}

	console.log("Post seeding Done. \n");
}

async function seedComments() {
	console.log("Comment seeding started...");

	for (let i = 0; i < 20; i++) {
		await prisma.comment.create({
			data: {
				content: faker.lorem.paragraph(),
				userId: faker.number.int({ min: 1, max: 7 }),
				postId: faker.number.int({ min: 1, max: 20 }),
			},
		});
	}

	console.log("Comment seeding Done. \n");
}

(async () => {
	await seedUsers();
	await seedPosts();
	await seedComments();
})();

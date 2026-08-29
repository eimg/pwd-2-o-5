import { prisma } from "../lib/prisma";

async function main() {
	const role = await prisma.role.update({
        where: { id: 1 },
        data: { name: "Guest" },
    });

	console.log(role);
}

main();

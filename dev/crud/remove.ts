import { prisma } from "../lib/prisma";

async function main() {
	const role = await prisma.role.delete({
        where: { id: 1 },
    });

	console.log(role);
}

main();

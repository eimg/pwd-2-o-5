import { prisma } from "../lib/prisma";

async function main() {
    const role = await prisma.role.create({
        data: {
            name: "User",
            value: 11,
        }
    });

    console.log(role);
}

main();

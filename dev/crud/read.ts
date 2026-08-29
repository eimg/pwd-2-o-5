import { prisma } from "../lib/prisma";

async function main() {
    const roles = await prisma.role.findMany();
    console.log(roles);
}

main();

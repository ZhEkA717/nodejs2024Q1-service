import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

const main = async () => {
    const FAVORITE_ID = 1;
    await prisma.favorites.upsert({
        where: {id: FAVORITE_ID},
        create: {
            albums: [],
            artists: [],
            tracks: [],
        },
        update: {}
    })
}

main().then(async () => {
    await prisma.$disconnect();
}).catch(async (err) => {
    console.log(err);
    await prisma.$disconnect();
    process.exit();
})
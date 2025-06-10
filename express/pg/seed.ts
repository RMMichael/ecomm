import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();

async function main() {
  // Example seed logic
  await prisma.user.createMany({
    data: [
        { name: "Seed User", email: "seed@example.com" },
      { name: "rick", email: "rick@me.com" },
      {name: "tj", email: "tj@me.com"}
    ].map((x, i) => {
      return {...x, googleId: `gId${i}`, picture: "pic"}
    })
  });
  console.log('Database seeded!');

  const allUsers = await prisma.user.findMany()
  console.log("users:", allUsers)
}

main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

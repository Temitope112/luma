import { prisma } from "../src/utils/prisma.js";

const EMAIL = "temitopeeniola295@gmail.com";

async function main() {
  const user = await prisma.user.findUnique({
    where: {
      email: EMAIL,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error(
      `No user found with email: ${EMAIL}`
    );
  }

  if (user.role === "ORGANIZER") {
    console.log(
      "\nThis user is already an ORGANIZER."
    );

    console.log(user);

    return;
  }

  const updatedUser =
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        role: "ORGANIZER",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

  console.log(
    "\nUser promoted successfully:"
  );

  console.log(updatedUser);
}

main()
  .catch((error) => {
    console.error(
      "\nFailed to promote user:"
    );

    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
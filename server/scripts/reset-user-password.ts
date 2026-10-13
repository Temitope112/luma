import bcrypt from "bcryptjs";
import { prisma } from "../src/utils/prisma.js";

const EMAIL = "test@gmail.com";
const NEW_PASSWORD = "Organizer123!";

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

  const hashedPassword =
    await bcrypt.hash(
      NEW_PASSWORD,
      12
    );

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,

      // Also invalidate any existing
      // password reset link.
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  console.log(
    "\nPassword reset successful."
  );

  console.log({
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
  });

  console.log(
    `\nTemporary password: ${NEW_PASSWORD}`
  );
}

main()
  .catch((error) => {
    console.error(
      "\nFailed to reset password:"
    );

    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
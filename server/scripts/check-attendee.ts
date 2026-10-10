import bcrypt from "bcryptjs";
import { prisma } from "../src/utils/prisma";

const main = async () => {
  const email = "attendee@gmail.com";
  const newPassword = "Attendee123!";

  try {
    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          email: true,
          role: true,
          password: true,
        },
      });

    if (!existingUser) {
      console.log(
        "❌ No user found with:",
        email
      );

      return;
    }

    console.log(
      "✅ User found:",
      existingUser.email,
      existingUser.role
    );

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        12
      );

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        password:
          hashedPassword,
      },
    });

    const updatedUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          password: true,
        },
      });

    if (!updatedUser) {
      console.log(
        "❌ User disappeared after update"
      );

      return;
    }

    const matches =
      await bcrypt.compare(
        newPassword,
        updatedUser.password
      );

    console.log(
      "Password matches:",
      matches
    );

    if (matches) {
      console.log(
        "✅ Reset successful"
      );

      console.log(
        "Email:",
        email
      );

      console.log(
        "Password:",
        newPassword
      );
    }
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

main();
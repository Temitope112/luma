import bcrypt from "bcryptjs";
import { prisma } from "../src/utils/prisma";

const resetPassword = async () => {
  try {
    const email = "attendee@gmail.com";
    const newPassword = "Attendee123!";

    const hashedPassword = await bcrypt.hash(
      newPassword,
      12
    );

    const user = await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    console.log("Password reset successfully");
    console.log(user);
    console.log(
      `Temporary password: ${newPassword}`
    );
  } catch (error) {
    console.error(
      "Unable to reset password:",
      error
    );
  } finally {
    await prisma.$disconnect();
  }
};

resetPassword();
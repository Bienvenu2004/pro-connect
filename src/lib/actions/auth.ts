"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role, JobCategory } from "@/generated/prisma/client";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "CLIENT" | "PROFESSIONAL";
  category?: string;
}

export async function registerUser(input: RegisterInput) {
  const { name, email, password, role, category } = input;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "emailInUse" };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role as Role,
      },
    });

    if (role === "CLIENT") {
      await prisma.clientProfile.create({
        data: { userId: user.id },
      });
    } else if (role === "PROFESSIONAL") {
      await prisma.professionalProfile.create({
        data: {
          userId: user.id,
          category: (category || "AUTRE") as JobCategory,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("registerUser error:", error);
    return { error: "serverError" };
  }
}

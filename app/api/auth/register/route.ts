import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("Start handling POST request");

    const body = await request.json();
    console.log("Request body:", body);

    const { email, name, password } = body;

    // Validar los datos recibidos
    if (!email || !name || !password) {
      console.log("Validation failed: Missing fields");
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    console.log("Hashing password");
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log("Creating user in database");
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    console.log("User created:", user);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error occurred during user registration:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

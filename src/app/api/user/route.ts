import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { query } from "@/lib/db";


const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as number;
    const email = payload.email as string;

    const users = await query("SELECT * FROM users WHERE userid = $1", [userId]);
    const user = users[0] || {};

    const userData = {
      id: userId,
      name: user.name || "John Doe",
      email,
      avatar: user.avatar,
    };

    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (err) {
    console.error("JWT Verify Error:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

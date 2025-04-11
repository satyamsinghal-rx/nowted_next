import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload) {
      return NextResponse.next();
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
export const config = {
  matcher: ["/api/notes/:path*", "/api/folders/:path*"],
};
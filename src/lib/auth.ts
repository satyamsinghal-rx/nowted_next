import * as jose from "jose";
import { query } from "./db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ACCESS_TOKEN_SECRET || "default-secret"
);

const COOKIE_NAME = "auth_token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60,
};

export const hashpassword = (password: string) => bcrypt.hash(password, 10);
export const comparePassword = (password: string, hash: string) =>
  bcrypt.compare(password, hash);

export const generateToken = async (userId: number, email: string) => {
  const token = await new jose.SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(JWT_SECRET);
  return token;
};

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    // const payload = await jose.jwtVerify(token, JWT_SECRET);
    return payload as { userId: number };
    // return payload;
  } catch {
    return null;
  }
};

export const authenticate = async (email: string, password: string) => {
  const users = await query("SELECT * FROM users WHERE email = $1", [email]);
  if (users.length === 0) return null;
  const user = users[0];
  if (await comparePassword(password, user.password)) {
    return { id: user.userid, email: user.email };
  }
  return null;
};

export const setAuthCookie = (response: NextResponse, token: string) => {
  response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
};

export const clearAuthCookie = (response: NextResponse) => {
    response.cookies.delete(COOKIE_NAME);
  };

  export const getAuthToken = (request: Request) => {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) return null;
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);
    return cookies[COOKIE_NAME] || null;
  };
  
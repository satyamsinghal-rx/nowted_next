// import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

// export async function middleware(req: NextRequest) {
//   const token = req.cookies.get("auth_token")?.value;
//   if (!token) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
//   try {
//     const { payload } = await jwtVerify(token, secret);
//     if (payload) {
//       return NextResponse.next();
//     } else {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
// }
// export const config = {
//   matcher: ["/api/notes/:path*", "/api/folders/:path*"],
// };



import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const pathname = req.nextUrl.pathname;
  const isAPIRequest = req.nextUrl.pathname.startsWith("/api");

  if (pathname === "/login") {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, secret);
        if (payload) {
          return NextResponse.redirect(new URL("/", req.url));
        }
      } catch (err) {
        console.error("JWT Verify Error:", err);
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }


  if (!token) {
    return handleUnauthorized(req, isAPIRequest);
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    if (payload) {
      return NextResponse.next();
    } else {
      return handleUnauthorized(req, isAPIRequest);
    }
  } catch (err) {
    console.error("JWT Verify Error:", err);
    return handleUnauthorized(req, isAPIRequest);
  }
}

function handleUnauthorized(req: NextRequest, isAPI: boolean) {
  if (isAPI) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } else {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/", 
    "/login",
    "/folders/:path*", 
    "/api/notes/:path*",
    "/api/folders/:path*",
    "/favorites",
    "/trash",
    "/archived",
  ],
};

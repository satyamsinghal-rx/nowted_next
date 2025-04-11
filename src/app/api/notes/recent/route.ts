import { getAuthToken, verifyToken } from "@/lib/auth";
import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    const decoded = token ? await verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notes = await query(
      "SELECT * FROM notes WHERE userid = $1 ORDER BY updatedAt DESC LIMIT 3",
      [decoded.userId]
    );
    return NextResponse.json({"recentNotes": notes});
  } catch (error) {
    console.error("Error fetching recent notes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

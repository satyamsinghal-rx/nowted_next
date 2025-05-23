import { getAuthToken, verifyToken } from "@/lib/auth";
import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    const decoded = token ? await verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await request.json();

    const existingFolder = await query(
      "SELECT * FROM folders WHERE userid = $1 AND name = $2 AND deletedat IS NULL",
      [decoded.userId, name]
    );

    if (existingFolder.length > 0) {
      return NextResponse.json(
        { error: "Folder already exists" },
        { status: 409 }
      );
    }

    const result = await query(
      "INSERT INTO folders (userid, name) VALUES ($1, $2) RETURNING *",
      [decoded.userId, name]
    );

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    const decoded = token ? await verifyToken(token) : null;

    if(!decoded){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const folders = await query('SELECT * FROM folders WHERE userid = $1 AND deletedAt IS NULL', [decoded.userId]);
    return NextResponse.json({"folders": folders});
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

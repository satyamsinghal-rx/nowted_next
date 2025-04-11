import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthToken, verifyToken } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = getAuthToken(request);
    const decoded = token ? await verifyToken(token) : null;
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await query(
      "UPDATE notes SET deletedat = NULL WHERE id = $1 AND userid = $2 RETURNING *",
      [params.id, decoded.userId]
    );

    await query(
        "UPDATE folders SET deletedat = NULL WHERE id = $1 AND userid = $2 RETURNING *",
        [result[0].folderid, decoded.userId]
      );

    if (result.length === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error restoring note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

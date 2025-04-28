import { getAuthToken, verifyToken } from "@/lib/auth";
import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getAuthToken(request);
    const decoded = token ? await verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const folder = await query(
      "SELECT * FROM folders WHERE id = $1 AND userid = $2",
      [params.id, decoded.userId]
    );
    if (folder.length === 0) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }
    return NextResponse.json(folder[0]);
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getAuthToken(request);
    const decoded = token ? await verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await request.json();

    const existingFolder = await query(
      "SELECT * FROM folders WHERE userid = $1 AND name = $2 AND id != $3",
      [decoded.userId, name, params.id]
    );

    if (existingFolder.length > 0) {
      return NextResponse.json(
        { error: "Folder with this name already exists" },
        { status: 409 }
      );
    }

    const folder = await query(
      "UPDATE folders SET name = $1 WHERE id = $2 AND userid = $3 RETURNING *",
      [name, params.id, decoded.userId]
    );
    if (folder.length === 0) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    return NextResponse.json(folder[0]);
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getAuthToken(request);
    const decoded = token ? await verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const folder = await query(
      "UPDATE folders SET deletedAt = NOW() WHERE id = $1 AND userid = $2 RETURNING *",
      [params.id, decoded.userId]
    );
    await query(
      "UPDATE notes SET deletedAt = NOW() WHERE folderid = $1 AND userid = $2",
      [params.id, decoded.userId]
    );
    if (folder.length === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(folder[0]);
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

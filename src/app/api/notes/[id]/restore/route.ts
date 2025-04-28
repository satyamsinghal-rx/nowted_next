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

    const noteToRestore = await query(
      "SELECT title, folderid FROM notes WHERE id = $1 AND userid = $2",
      [params.id, decoded.userId]
    );

    if (noteToRestore.length === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const noteName = noteToRestore[0].title;
    const folderId = noteToRestore[0].folderid;

    const existingNote = await query(
      "SELECT id, title FROM notes WHERE title = $1 AND userid = $2 AND id != $3 AND deletedat IS NULL",
      [noteName, decoded.userId, params.id]
    );

    if (existingNote.length > 0) {
      return NextResponse.json(
        {
          error: "Note name conflict",
          existingNote: { id: existingNote[0].id, title: existingNote[0].title },
          message: "A note with the same name already exists.",
        },
        { status: 409 }
      );
    }

    const folderToRestore = await query(
      "SELECT name FROM folders WHERE id = $1 AND userid = $2",
      [folderId, decoded.userId]
    );

    if (folderToRestore.length === 0) {
      return NextResponse.json(
        { error: "Associated folder not found" },
        { status: 404 }
      );
    }

    const folderName = folderToRestore[0].name;

    const existingFolder = await query(
      "SELECT id, name FROM folders WHERE name = $1 AND userid = $2 AND id != $3 AND deletedat IS NULL",
      [folderName, decoded.userId, folderId]
    );

    if (existingFolder.length > 0) {
      return NextResponse.json(
        {
          error: "Folder name conflict",
          existingFolder: { id: existingFolder[0].id, name: existingFolder[0].name },
          message: `A folder named "${folderName}" already exists.`,
        },
        { status: 409 }
      );
    }

    const result = await query(
      "UPDATE notes SET deletedat = NULL WHERE id = $1 AND userid = $2 RETURNING *",
      [params.id, decoded.userId]
    );

    if (result.length === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    await query(
      "UPDATE folders SET deletedat = NULL WHERE id = $1 AND userid = $2 RETURNING *",
      [folderId, decoded.userId]
    );

    return NextResponse.json({ note: result[0] });
  } catch (error) {
    console.error("Error restoring note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
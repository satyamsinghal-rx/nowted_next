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

    const result = await query(
      `SELECT 
        notes.id AS note_id,
        notes.folderid,
        notes.title,
        notes.content,
        notes.isFavorite,
        notes.isArchived,
        notes.createdAt AS note_createdAt,
        notes.updatedAt AS note_updatedAt,
        notes.deletedAt AS note_deletedAt,
        folders.id AS folder_id,
        folders.name AS folder_name,
        folders.createdAt AS folder_createdAt,
        folders.updatedAt AS folder_updatedAt,
        folders.deletedAt AS folder_deletedAt
      FROM notes
      INNER JOIN folders ON notes.folderid = folders.id
      WHERE notes.userid = $1
      ORDER BY notes.updatedAt DESC
      LIMIT 3`,
      [decoded.userId]
    );

    interface Note {
      note_id: number;
      folderid: number;
      title: string;
      content: string;
      isFavorite: boolean;
      isArchived: boolean;
      note_createdat: string;
      note_updatedat: string;
      note_deletedat: string | null;
      folder_id: number;
      folder_name: string;
      folder_createdat: string;
      folder_updatedat: string;
      folder_deletedat: string | null;
    }

    const responseNotes = result.map((note: Note) => ({
      id: note.note_id,
      folderId: note.folderid,
      title: note.title,
      content: note.content,
      isFavorite: note.isFavorite,
      isArchived: note.isArchived,
      createdAt: note.note_createdat,
      updatedAt: note.note_updatedat,
      deletedAt: note.note_deletedat,
      folder: {
        id: note.folder_id,
        name: note.folder_name,
        createdAt: note.folder_createdat,
        updatedAt: note.folder_updatedat,
        deletedAt: note.folder_deletedat,
      },
    }));

    return NextResponse.json({ recentNotes: responseNotes });
  } catch (error) {
    console.error("Error fetching recent notes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { getAuthToken, verifyToken } from "@/lib/auth";
import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest, {params}: {params: {id: string}}) {
//   try {
//     const token = getAuthToken(request);
//     const decoded = token ? await verifyToken(token) : null;

//     if (!decoded) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const note = await query('SELECT * FROM notes WHERE id = $1 AND userid = $2 AND deletedAt IS NULL', [params.id, decoded.userId]);
//     if (note.length === 0) {
//       return NextResponse.json({ error: "Note not found or Deleted" }, { status: 404 });
//     }
//     return NextResponse.json({"note": note[0]});

//   } catch (error) {
//     console.error("Error fetching note:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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
      WHERE notes.id = $1 AND notes.userid = $2`,
      [params.id, decoded.userId]
    );

    if (result.length === 0) {
      return NextResponse.json({ error: "Note not found or deleted" }, { status: 404 });
    }

    const note = result[0];

    const responseNote = {
      id: note.note_id,
      folderId: note.folderid,
      title: note.title,
      content: note.content,
      isFavorite: note.isfavorite,
      isArchived: note.isarchived,
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
    };

    return NextResponse.json({ note: responseNote });
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}




export async function PATCH(request: NextRequest, {params}: {params: {id: string}}){
    try {
        const token = getAuthToken(request);
        const decoded = token ? await verifyToken(token) : null;
    
        if (!decoded) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        const { title, content, isFavorite, isArchived, folderId } = await request.json();

        if (
          title === undefined &&
          content === undefined &&
          isFavorite === undefined &&
          isArchived === undefined &&
          folderId === undefined
        ) {
          return NextResponse.json({ error: "No fields provided to update" }, { status: 400 });
        }


        if (title && folderId) {
          const existingNote = await query(
            "SELECT * FROM notes WHERE userid = $1 AND folderid = $2 AND title = $3 AND id != $4",
            [decoded.userId, folderId, title, params.id]
          );
    
          if (existingNote.length > 0) {
            return NextResponse.json(
              { error: "A note with this title already exists in the folder" },
              { status: 409 }
            );
          }
        }

        const note = await query('UPDATE notes SET title = COALESCE($1, title), content = COALESCE($2, content), isfavorite = COALESCE($3, isfavorite), isarchived = COALESCE($4, isarchived), folderid = COALESCE($5, folderid) WHERE id = $6 AND userid = $7 RETURNING *', [title, content, isFavorite, isArchived, folderId, params.id, decoded.userId]);
        if (note.length === 0) {    
          return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        return NextResponse.json(note[0]);
    
      } catch (error) {
        console.error("Error fetching note:", error);
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      }
}

export async function DELETE(request: NextRequest, {params}: {params: {id: string}}){
    try {
        const token = getAuthToken(request);
        const decoded = token ? await verifyToken(token) : null;
    
        if (!decoded) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        const note = await query('UPDATE notes SET deletedAt = NOW() WHERE id = $1 AND userid = $2 AND deletedAt IS NULL RETURNING *', [params.id, decoded.userId]);
        if (note.length === 0) {    
          return NextResponse.json({ error: "Note not found or Already Deleted" }, { status: 404 });
        }

        return NextResponse.json(note[0]);
    
      } catch (error) {
        console.error("Error fetching note:", error);
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      }
}

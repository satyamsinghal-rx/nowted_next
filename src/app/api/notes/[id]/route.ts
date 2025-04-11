import { getAuthToken, verifyToken } from "@/lib/auth";
import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}: {params: {id: string}}) {
  try {
    const token = getAuthToken(request);
    const decoded = token ? await verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const note = await query('SELECT * FROM notes WHERE id = $1 AND userid = $2', [params.id, decoded.userId]);
    if (note.length === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    return NextResponse.json({"note": note[0]});

  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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
    
        const note = await query('UPDATE notes SET deletedAt = NOW() WHERE id = $1 AND userid = $2 RETURNING *', [params.id, decoded.userId]);
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

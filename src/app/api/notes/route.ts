import { getAuthToken, verifyToken } from "@/lib/auth";
import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { title, content, folderId, isArchived, isFavorite } = await request.json();

    const token = getAuthToken(request);
    const decoded = token ? await verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingNote = await query(
      "SELECT * FROM notes WHERE userid = $1 AND folderid = $2 AND title = $3 AND deletedat IS NULL",
      [decoded.userId, folderId, title]
    );

    if (existingNote.length > 0) {
      return NextResponse.json(
        { error: "Note with the same title already exists in this folder" },
        { status: 409 }
      );
    }

    const result = await query(
      "INSERT INTO notes (userid, title, content, folderid, isArchived, isFavorite) VALUES ($1, $2, $3, $4, COALESCE($5, false), COALESCE($6, false)) RETURNING *",
      [decoded.userId, title, content, folderId, isArchived, isFavorite]
    );
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// export async function GET(request: NextRequest) {
//   try {
//     const token = getAuthToken(request);
//     const decoded = token ? await verifyToken(token) : null;

//     if (!decoded) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const notes = await query("SELECT * FROM notes WHERE userid = $1", [
//       decoded.userId,
//     ]);
//     return NextResponse.json(notes);
//   } catch (error) {
//     console.error("Error fetching notes:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }




// export async function GET(request: NextRequest) {
//     try {
//       const token = getAuthToken(request);
//       const decoded = token ? await verifyToken(token) : null;
  
//       if (!decoded) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//       }
  
//       const searchParams = request.nextUrl.searchParams;
//       const archived = searchParams.get('archived');
//       const favorite = searchParams.get('favorite');
//       const deleted = searchParams.get('deleted');
//       const folderId = searchParams.get('folderId');
//       const page = searchParams.get('page');
//       const limit = searchParams.get('limit');
//       const search = searchParams.get('search');
  
  
//       let queryStr = 'SELECT * FROM notes WHERE userid = $1';
//       const params: (string | number)[] = [decoded.userId];
//       let paramIndex = 2;
  

//       if (archived !== null) {
//         queryStr += ` AND isArchived = $${paramIndex}`;
//         params.push(archived === 'true' ? "true" : "false");
//         paramIndex++;
//       }
  

//       if (favorite !== null) {
//         queryStr += ` AND isFavorite = $${paramIndex}`;
//         params.push(favorite === 'true' ? "true" : "false");
//         paramIndex++;
//       }
  
//       if (deleted !== null) {
//         queryStr += ` AND deletedAt IS ${deleted === 'true' ? 'NOT NULL' : 'NULL'}`;
        
//       }
  
//       if (folderId !== null) {
//         queryStr += ` AND folderid = $${paramIndex}`;
//         params.push(folderId);
//         paramIndex++;
//       }
  
//       if (search !== null && search !== '') {
//         queryStr += ` AND (title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`;
//         params.push('%' + search + '%');
//         paramIndex++;
//       }
  
//       const limitValue = limit ? parseInt(limit) : 10;
//       const pageValue = page ? parseInt(page) : 1;
//       const offset = (pageValue - 1) * limitValue;
  
//       queryStr += ` LIMIT $${paramIndex}`;
//       params.push(limitValue);
//       paramIndex++;
  
//       queryStr += ` OFFSET $${paramIndex}`;
//       params.push(offset);
  
//       const notes = await query(queryStr, params);
//       return NextResponse.json({"notes": notes});
//     } catch (error) {
//       console.error("Error fetching notes:", error);
//       return NextResponse.json(
//         { error: "Internal server error" },
//         { status: 500 }
//       );
//     }
//   }




export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    const decoded = token ? await verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const archived = searchParams.get("archived");
    const favorite = searchParams.get("favorite");
    const deleted = searchParams.get("deleted");
    const folderId = searchParams.get("folderId");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const search = searchParams.get("search");

    let queryStr = `
      SELECT notes.*, folders.name AS folder_name, 
             folders.createdAt AS folder_createdAt, 
             folders.updatedAt AS folder_updatedAt, 
             folders.deletedAt AS folder_deletedAt
      FROM notes 
      INNER JOIN folders ON notes.folderid = folders.id 
      WHERE notes.userid = $1 AND notes.deletedat IS NULL AND notes.isarchived = false
    `;
    const params: (string | number)[] = [decoded.userId];
    let paramIndex = 2;

    // if (archived !== null) {
    //   queryStr += ` AND notes.isarchived = $${paramIndex}`;
    //   params.push(archived === "true");
    //   paramIndex++;
    // }

    if (archived === "true") {
      queryStr = queryStr.replace("notes.isarchived = false", "notes.isarchived = true");
    }

    if (favorite !== null) {
      queryStr += ` AND notes.isfavorite = $${paramIndex}`;
      params.push(favorite === "true" ? "true" : "false");
      paramIndex++;
    }

    if (deleted === "true") {
      queryStr = queryStr.replace("notes.deletedat IS NULL", "notes.deletedAt IS NOT NULL");
    }

    if (folderId !== null) {
      queryStr += ` AND notes.folderid = $${paramIndex}`;
      params.push(folderId);
      paramIndex++;
    }

    if (search !== null && search !== "") {
      queryStr += ` AND (notes.title ILIKE $${paramIndex} OR notes.content ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    const limitValue = limit ? parseInt(limit) : 10;
    const pageValue = page ? parseInt(page) : 1;
    const offset = (pageValue - 1) * limitValue;

    queryStr += ` ORDER BY notes.updatedat DESC`;

    queryStr += ` LIMIT $${paramIndex}`;
    params.push(limitValue);
    paramIndex++;

    queryStr += ` OFFSET $${paramIndex}`;
    params.push(offset);

    const rawNotes = await query(queryStr, params);

    const notes = rawNotes.map((note) => ({
      id: note.id,
      folderId: note.folderid,
      title: note.title,
      isFavorite: note.isfavorite,
      isArchived: note.isarchived,
      createdAt: note.createdat,
      updatedAt: note.updatedat,
      deletedAt: note.deletedat,
      preview: note.content?.slice(0, 100) || "", 
      folder: {
        id: note.folderid,
        name: note.folder_name,
        createdAt: note.folder_createdat,
        updatedAt: note.folder_updatedAt,
        deletedAt: note.folder_deletedAt,
      },
    }));

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

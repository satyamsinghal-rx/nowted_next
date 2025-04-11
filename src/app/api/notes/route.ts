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

export async function GET(request: NextRequest) {
    try {
      const token = getAuthToken(request);
      const decoded = token ? await verifyToken(token) : null;
  
      if (!decoded) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const searchParams = request.nextUrl.searchParams;
      const archived = searchParams.get('archived');
      const favorite = searchParams.get('favorite');
      const deleted = searchParams.get('deleted');
      const folderId = searchParams.get('folderId');
      const page = searchParams.get('page');
      const limit = searchParams.get('limit');
      const search = searchParams.get('search');
  
  
      let queryStr = 'SELECT * FROM notes WHERE userid = $1';
      const params: (string | number)[] = [decoded.userId];
      let paramIndex = 2;
  

      if (archived !== null) {
        queryStr += ` AND isArchived = $${paramIndex}`;
        params.push(archived === 'true' ? "true" : "false");
        paramIndex++;
      }
  

      if (favorite !== null) {
        queryStr += ` AND isFavorite = $${paramIndex}`;
        params.push(favorite === 'true' ? "true" : "false");
        paramIndex++;
      }
  
      if (deleted !== null) {
        queryStr += ` AND deletedAt IS ${deleted === 'true' ? 'NOT NULL' : 'NULL'}`;
        
      }
  
      if (folderId !== null) {
        queryStr += ` AND folderid = $${paramIndex}`;
        params.push(folderId);
        paramIndex++;
      }
  
      if (search !== null && search !== '') {
        queryStr += ` AND (title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`;
        params.push('%' + search + '%');
        paramIndex++;
      }
  
      const limitValue = limit ? parseInt(limit) : 10;
      const pageValue = page ? parseInt(page) : 1;
      const offset = (pageValue - 1) * limitValue;
  
      queryStr += ` LIMIT $${paramIndex}`;
      params.push(limitValue);
      paramIndex++;
  
      queryStr += ` OFFSET $${paramIndex}`;
      params.push(offset);
  
      const notes = await query(queryStr, params);
      return NextResponse.json({"notes": notes});
    } catch (error) {
      console.error("Error fetching notes:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

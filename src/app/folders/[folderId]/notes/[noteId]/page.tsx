"use client";

import { getFolders, getNoteById, getNotes, } from "@/apis/api";
import NoteEditor from "@/components/NoteEditor/NoteEditor";
import NotesList from "@/components/NotesList/NotesList";
import { useQuery } from "@tanstack/react-query";
import React, { use } from "react";

function NotesPage({
  params,
}: {
  params: Promise<{ folderId?: string; noteId: string; view?: string }>;
}) {
  const { folderId, noteId, view } = use(params);

  console.log("Params in NotesPage:", params); // Debugging
console.log("Extracted noteId:", noteId);


  // Fetch the specific note
  const { data: note } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => getNoteById(noteId),
    enabled: !!noteId,
  });

  // Fetch folders
  const { data: folders = [] } = useQuery({
    queryKey: ["folders"],
    queryFn: getFolders,
  });

  // Fetch notes
  const { data: notesByFolder = [] } = useQuery({
    queryKey: ["notes", folderId],
    queryFn: () => getNotes({ folderId }),
    enabled: !!folderId && view !== "favorites",
  });

  // Fetch favorite notes if view is "favorites"
  const { data: favoriteNotes = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => getNotes({ favorite: true }),
    enabled: view === "favorites",
  });

  const getTitle = () => {
    if (view === "favorites") return "Favorite Notes";
    if (folderId) {
      const folder = folders.find((folder) => folder.id === folderId);
      return folder?.name || "Select A Folder";
    }
    return "All Notes";
  };

  const title: string = getTitle();
  const initialParams = { folderId: folderId ?? undefined, page: 1, limit: 10 };

  return (
    <>
      <NotesList notes={view === "favorites" ? favoriteNotes : notesByFolder} title={title} initialParams={initialParams} />
      {note && <NoteEditor note={note} />}
    </>
  );
}

export default NotesPage;

"use client";

import { getFolders, getNoteById, getNotes } from "@/apis/api";
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
  console.log("Params in NotesPage:", { folderId, noteId, view });

  const { data: note} = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => getNoteById(noteId),
    enabled: !!noteId,
  });

  const { data: folders = [] } = useQuery({
    queryKey: ["folders"],
    queryFn: getFolders,
  });

  const { data: notesByFolder = [] } = useQuery({
    queryKey: ["notes", folderId],
    queryFn: () => getNotes({ folderId}),
    enabled: !!folderId && view !== "favorites" && view !== "archived" && view !== "trash",
  });

  const { data: favoriteNotes = [] } = useQuery({
    queryKey: [`"favorites"`],
    queryFn: () => getNotes({ favorite: true }),
    enabled: view === "favorites",
  });

  const { data: archivedNotes = [] } = useQuery({
    queryKey: [`"archived"`],
    queryFn: () => getNotes({ archived: true }),
    enabled: view === "archived",
  });

  const { data: deletedNotes = [] } = useQuery({
    queryKey: [`"trash"`],
    queryFn: () => getNotes({ deleted: true }),
    enabled: view === "trash",
  });

  const getTitle = () => {
    if (view === "favorites") return "Favorite Notes";
    if (view === "archived") return "Archived Notes";
    if (view === "trash") return "Trash Notes";
    if (folderId) {
      const folder = folders.find((folder) => folder.id === folderId);
      return folder?.name || "Select A Folder";
    }
    return "All Notes";
  };

  const title = getTitle();
  const initialParams = { folderId: folderId ?? undefined, page: 1, limit: 10 };


  return (
    <>
      <NotesList
        notes={
          view === "favorites"
            ? favoriteNotes
            : view === "archived"
            ? archivedNotes
            : view === "trash"
            ? deletedNotes
            : notesByFolder
        }
        title={title}
        initialParams={initialParams}
      />
      {note ? (
        <NoteEditor note={note} />
      ) : (
        <div>No note found for noteId: {noteId}</div>
      )}
    </>
  );
}

export default NotesPage;
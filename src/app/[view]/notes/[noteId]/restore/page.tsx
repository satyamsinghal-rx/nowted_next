"use client";

import { getFolders, getNoteById, getNotes } from "@/apis/api";
import RestoreNote from "@/components/NoteEditor/RestoreNote";
import NotesList from "@/components/NotesList/NotesList";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";

function ViewRestorePage() {
  const params = useParams();
  const folderId = Array.isArray(params.folderId)
    ? params.folderId[0]
    : params.folderId;
  const noteId = Array.isArray(params.noteId)
    ? params.noteId[0]
    : params.noteId;

  const { data: note } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => (noteId ? getNoteById(noteId) : Promise.reject("Note ID is undefined")),
    enabled: !!noteId,
  });

  const { data: notesByFolder = [] } = useQuery({
    queryKey: ["notes", folderId],
    queryFn: () => getNotes({ folderId }),
  });

  const { data: folders = [] } = useQuery({
      queryKey: ["folders"],
      queryFn: getFolders,
    });

    const getTitle = () => {
        
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
        notes={notesByFolder}
        title={
          title
        }
        initialParams={initialParams}
      />
      <RestoreNote
        noteId={note?.id || "Unknown ID"}
        noteTitle={note?.title || "Untitled Note"}
        folderId={note?.folderId || "Unknown Folder ID"}
      />
    </>
  );
}

export default ViewRestorePage;

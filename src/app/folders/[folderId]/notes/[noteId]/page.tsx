"use client";

import { getFolders, getNoteById, getNotes } from "@/apis/api";
import NoteEditor from "@/components/NoteEditor/NoteEditor";
import NotesList from "@/components/NotesList/NotesList";
import { useQuery } from "@tanstack/react-query";
import React, { use } from "react";

function NotesPage({
  params,
}: {
  params: Promise<{ folderId: string; noteId: string }>;
}) {
  const { noteId } = use(params);
  const { folderId } = use(params);

  const { data: note } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => getNoteById(noteId),
  });

  const { data: folders = [] } = useQuery({
    queryKey: ["folders"],
    queryFn: getFolders,
  });

  const { data: notesByFolder = [] } = useQuery({
    queryKey: ["notes", folderId],
    queryFn: () => {
      console.log("Fetching notes for folderId:", folderId);
      return getNotes({ folderId: folderId });
    },
    enabled: !!folderId,
  });

  const getTitle = () => {
    if (folderId) {
      const folder = folders.find((folder) => folder.id === folderId);
      return folder?.name || "Select A Folder";
    } else {
      return "All Notes";
    }
  };
  const title: string = getTitle();

  return (
    <>
      <NotesList notes={notesByFolder} title={title} />
      <NoteEditor note = {note}/>
    </>
  );
}

export default NotesPage;

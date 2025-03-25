import { Box} from '@mui/material'
import React from 'react'
import NoteHeader from './NoteHeader'
import NoteContent from './NoteContent';
import RestoreNote from './RestoreNote';
import { getFolders } from '@/apis/api';
import { useQuery } from '@tanstack/react-query';
interface Note {
  id?: string;
  title?: string;
  content?: string;
  folderId?: string;
  createdAt?: string;
  folder?: {
    name: string;
    id: string;
  };
  isArchived?: boolean;
  isFavorite?: boolean;
  deletedAt?: string | null;
}

function NoteEditor({ note }: { note: Note }) {

  const { data: folders = []} = useQuery({
    queryKey: ["folders"],
    queryFn: getFolders,
  });

  if(note.deletedAt !== null) {
    return <RestoreNote noteId={note.id || "Unknown ID"} noteTitle={note.title || "Untitled Note"} folderId={note.folderId || "Unknown Folder ID"}/>
  }
  else{

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: "900px",
        backgroundColor: "#181818",
        color: "white",
        paddingX: "50px",
        paddingY: "16px",
        height: "100vh",
      }}
    >
      <NoteHeader
        noteId={note?.id || ""}
        initialTitle={note?.title || "Untitled Note"}
        date={note?.createdAt || "No date"}
        folder={note?.folder?.name || "No Folder"}
        folderId = {note?.folder?.id || ""}
        isFavorite={note?.isFavorite || false}
        isArchived={note?.isArchived || false}
        availableFolders={folders}

      />
      <NoteContent noteId={note?.id || ""} initialContent={note?.content || ""} />
    </Box>
  )
  }


}

export default NoteEditor;
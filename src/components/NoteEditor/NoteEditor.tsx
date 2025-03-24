import { Box} from '@mui/material'
import React from 'react'
import NoteHeader from './NoteHeader'
import NoteContent from './NoteContent';
interface Note {
  id?: string;
  title?: string;
  content?: string;
  createdAt?: string;
  folder?: {
    name: string;
  };
}

function NoteEditor({ note }: { note: Note }) {
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
      />
      <NoteContent noteId={note?.id || ""} initialContent={note?.content || ""} />
    </Box>
  )
}

export default NoteEditor;
import { Box, Typography } from '@mui/material'
import React from 'react'
import NoteHeader from './NoteHeader'

function NoteEditor({note}) {
  return (
    <Box
      sx={{
        width: "900px",
        backgroundColor: "#181818",
        color: "white",
        padding: "16px",
        height: "100vh",
      }}
    >
        <NoteHeader />
        <Typography>{note?.title || "Untitled Note"}</Typography>
        <Typography>{note?.content || "Untitled Note"}</Typography>
    </Box>
  )
}

export default NoteEditor
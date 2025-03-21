"use client";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";


interface Note {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
}

interface NotesListProps {
  notes: Note[];
  title: string;
}

function NotesList({ notes, title }: NotesListProps) {

    const router = useRouter();
  

  
  return (
    <Box
      sx={{
        width: "320px",
        backgroundColor: "#1C1C1C",
        color: "white",
        padding: "16px",
        height: "100vh",
      }}
    >
      <Typography>{title}</Typography>
      {/* <List>
        {notes.map((note) => (
          <ListItemButton key={note.id} sx={{ padding: "2px 8px" }}>
            <ListItem sx={{ padding: "2px 8px" }}>
              <ListItemText primary={note.title} />
            </ListItem>
          </ListItemButton>
        ))}
      </List> */}

{notes.map((note) => {
  const formattedDate = new Date(note.updatedAt).toLocaleDateString(
    "en-GB"
  );
  return ((
    <Card 
    onClick={() => router.push(`/folders/${note.folder.id}/notes/${note.id}`)}
    key={note.id} 
      sx={{
        backgroundColor: '#1E1E1E',
        color: 'white',
        borderRadius: '12px', 
        mb: 2, 
        '&:hover': {
          backgroundColor: '#2A2A2A', 
        },
      }}
    >
      <CardActionArea>
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            {note.title}
          </Typography>
          <Typography variant="body2" color="gray">
            {formattedDate} &nbsp; {note.preview}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  ))
})}

    </Box>
  );
}

export default NotesList;

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { getNotes } from "@/apis/api";
import { Note, NotesParams } from "@/types/type";

interface NotesListProps {
  notes: Note[];
  title: string;
  initialParams: Partial<NotesParams>;
}

function NotesList({
  notes: initialNotes,
  title,
  initialParams,
}: NotesListProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [notes, setNotes] = useState<Note[]>(initialNotes || []);
  const [page, setPage] = useState<number>(initialParams.page || 1);
  const [hasMore, setHasMore] = useState<boolean>(  
    Array.isArray(initialNotes) &&
      initialNotes.length === (initialParams.limit || 10)
  );

  useEffect(() => {
    setNotes(initialNotes || []);
    setPage(1); // Reset to first page on update
    setHasMore(
      Array.isArray(initialNotes) &&
        initialNotes.length === (initialParams.limit || 10)
    );
    queryClient.setQueryData(["notes", initialParams, 1], initialNotes);
  }, [initialNotes, initialParams, queryClient]);

  const loadMoreNotes = async () => {
    const nextPage = page + 1;
    const newParams = { ...initialParams, page: nextPage };
    const newNotes = (await getNotes(newParams)) || [];
    console.log("New notes:", newNotes);
    setNotes((prev) => {
      const updatedNotes = [...prev, ...newNotes];
      console.log("Updated notes state:", updatedNotes);
      setPage(nextPage);
      setHasMore(newNotes.length === (initialParams.limit || 10));
      queryClient.setQueryData(["notes", newParams], newNotes);
      return updatedNotes;
    });
  };

  const handleNoteClick = (note: Note) => {
    if (pathname.includes("favorites")) {
      router.push(`/favorites/notes/${note.id}`);
    } else {
      router.push(`/folders/${note.folderId}/notes/${note.id}`);
    }
  };
  

  return (
    <Box
      sx={{
        width: "320px",
        backgroundColor: "#1C1C1C",
        color: "white",
        padding: "16px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography sx={{ mb: 2 }}>{title}</Typography>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#2A2A2A",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#555",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#777",
          },
        }}
      >
        {notes.length > 0 ? (
          notes.map((note) => {
            const formattedDate = new Date(note.updatedAt).toLocaleDateString(
              "en-GB"
            );
            return (
              <Card
                onClick={() =>
                  handleNoteClick(note)
                }
                key={note.id}
                sx={{
                  backgroundColor: "#1E1E1E",
                  color: "white",
                  borderRadius: "12px",
                  mb: 2,
                  "&:hover": {
                    backgroundColor: "#2A2A2A",
                  },
                }}
              >
                <CardActionArea>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {note.title}
                    </Typography>
                    <Typography variant="body2" color="gray">
                      {formattedDate}   {note.preview}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })
        ) : (
          <Typography color="gray" textAlign="center">
            No Notes Found
          </Typography>
        )}

        {hasMore && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button onClick={loadMoreNotes} variant="contained" color="primary">
              Load More
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default NotesList;

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
    setPage(1);
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
    } else if (pathname.includes("archived")) {
      router.push(`/archived/notes/${note.id}`);
    } else if (pathname.includes("trash")) {
      router.push(`/trash/notes/${note.id}`);
    } else {
      router.push(`/folders/${note.folderId}/notes/${note.id}`);
    }
  };

  const truncatePreview = (text: string, maxLength: number = 25): string => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Box
      sx={{
        width: "380px",
        backgroundColor: "#1C1C1C",
        color: "white",
        padding: "24px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography sx={{ fontSize: "24px", fontWeight: "bold", mb: 2 }}>
        {title}
      </Typography>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
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
                onClick={() => handleNoteClick(note)}
                key={note.id}
                sx={{
                  height: "100px",
                  backgroundColor: "#FFFFFF08",
                  color: "white",
                  borderRadius: "2px",
                  mb: 3,
                  "&:hover": {
                    backgroundColor: "#2A2A2A",
                  },
                }}
              >
                <CardActionArea>
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      paddingBottom={1}
                    >
                      {note.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="gray"
                      display="flex"
                      justifyContent="space-between"
                      component="div"
                    >
                      <Typography component="span">{formattedDate}</Typography>{" "}
                       
                      <Typography component="span">
                        {truncatePreview(note.preview)}
                      </Typography>
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

import { updateNote } from "@/apis/api";
import { Box, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";

function NoteContent({
  noteId,
  initialContent,
}: {
  noteId: string;
  initialContent: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newContent: string) =>
      updateNote(noteId, { content: newContent }),
    onSuccess: () => {
      // Invalidate all notes queries
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", noteId] });

      // Optionally, you could optimistically update the cache here
      // queryClient.setQueryData(['notes'], (oldData: Note[] | undefined) => {
      //   if (!oldData) return;
      //   return oldData.map(note =>
      //     note.id === noteId ? { ...note, content: newContent } : note
      //   );
      // });
    },
  });

  const handleUpdate = useCallback(
    (newContent: string) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeout = setTimeout(() => {
        if (newContent !== initialContent) {
          mutation.mutate(newContent);
        }
      }, 500);

      setTimeoutId(newTimeout);
    },
    [mutation, initialContent, timeoutId]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setContent(newValue);
    handleUpdate(newValue);
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 230px)",
        overflowY: "auto",
        py: 2,
        borderRadius: 2,
        color: "white",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <TextField
        multiline
        fullWidth
        variant="standard"
        value={content}
        onChange={handleChange}
        InputProps={{
          disableUnderline: true, 
          sx: {
            color: "white",
            fontSize: "16px",
            padding: 0,
          },
        }}
        sx={{
          "& .MuiInputBase-root": {
            minHeight: "100px",
            resize: "none",
          },
        }}
      />
    </Box>
  );
}

export default NoteContent;

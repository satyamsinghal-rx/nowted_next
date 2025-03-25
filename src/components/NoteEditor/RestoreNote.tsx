import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreNoteById } from "@/apis/api";
import { useRouter } from "next/navigation"; 
import restoreIcon from "@/../public/icons/restore.svg";
import Image from "next/image";

interface RestoreNoteProps {
  noteId: string;
  noteTitle: string;
  folderId: string;
}

function RestoreNote({ noteId, noteTitle, folderId }: RestoreNoteProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const restoreMutation = useMutation({
    mutationFn: () => restoreNoteById(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push(`/folders/${folderId}/notes/${noteId}`);
    },
    onError: (error) => {
      console.error("Error restoring note:", error);

      alert("Failed to restore the note. Please try again.");
    },
  });

  const handleRestore = () => {
    restoreMutation.mutate();
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: "900px",
        color: "white",
        paddingX: "50px",
        paddingY: "16px",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Image src={restoreIcon} alt="Restore Icon"/>

        <Typography
          variant="h6"
          sx={{
            fontSize: "32px",
            fontWeight: "bold",
            mb: 1,
          }}
        >
          Restore {noteTitle}
        </Typography>

        <Typography
          variant="body2" color="gray" align="center" marginBottom={2}
        >
          Don’t want to lose this note? It’s not too late! <br></br>Just click the
          ‘Restore’ button and it will be added back to your list. It’s that
          simple.
        </Typography>

        <Button
          variant="contained"
          onClick={handleRestore}
          disabled={restoreMutation.isPending}
          sx={{
            backgroundColor: "#1976D2",
            color: "white",
            textTransform: "none",
            borderRadius: "6px",
            px: 4,
            py: 1,
            "&:hover": {
              backgroundColor: "#312EB5",
            },
          }}
        >
          {restoreMutation.isPending ? "Restoring..." : "Restore"}
        </Button>
      </Box>
    </Box>
  );
}

export default RestoreNote;

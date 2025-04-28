// import React from "react";
// import { Box, Typography, Button } from "@mui/material";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { restoreNoteById } from "@/apis/api";
// import { useRouter } from "next/navigation"; 
// import restoreIcon from "@/../public/icons/restore.svg";
// import Image from "next/image";

// interface RestoreNoteProps {
//   noteId: string;
//   noteTitle: string;
//   folderId: string;
// }

// function RestoreNote({ noteId, noteTitle, folderId }: RestoreNoteProps) {
//   const queryClient = useQueryClient();
//   const router = useRouter();

//   const restoreMutation = useMutation({
//     mutationFn: () => restoreNoteById(noteId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["notes"] });
//       router.push(`/folders/${folderId}/notes/${noteId}`);
//     },
//     onError: (error) => {
//       console.error("Error restoring note:", error);

//       alert("Failed to restore the note. Please try again.");
//     },
//   });

//   const handleRestore = () => {
//     restoreMutation.mutate();
//   };

//   return (
//     <Box
//       sx={{
//         flexGrow: 1,
//         width: "900px",
//         color: "white",
//         paddingX: "50px",
//         paddingY: "16px",
//         height: "100vh",
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "100%",
//         }}
//       >
//         <Image src={restoreIcon} alt="Restore Icon"/>

//         <Typography
//           variant="h6"
//           sx={{
//             fontSize: "32px",
//             fontWeight: "bold",
//             mb: 1,
//           }}
//         >
//           Restore {noteTitle}
//         </Typography>

//         <Typography
//           variant="body2" color="gray" align="center" marginBottom={2}
//         >
//           Don’t want to lose this note? It’s not too late! <br></br>Just click the
//           ‘Restore’ button and it will be added back to your list. It’s that
//           simple.
//         </Typography>

//         <Button
//           variant="contained"
//           onClick={handleRestore}
//           disabled={restoreMutation.isPending}
//           sx={{
//             backgroundColor: "#1976D2",
//             color: "white",
//             textTransform: "none",
//             borderRadius: "6px",
//             px: 4,
//             py: 1,
//             "&:hover": {
//               backgroundColor: "#312EB5",
//             },
//           }}
//         >
//           {restoreMutation.isPending ? "Restoring..." : "Restore"}
//         </Button>
//       </Box>
//     </Box>
//   );
// }

// export default RestoreNote;

// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
// } from "@mui/material";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { restoreNoteById, deleteNote, updateNote } from "@/apis/api";
// import { useRouter } from "next/navigation";
// import restoreIcon from "@/../public/icons/restore.svg";
// import Image from "next/image";

// interface RestoreNoteProps {
//   noteId: string;
//   noteTitle: string;
//   folderId: string;
// }

// function RestoreNote({ noteId, noteTitle, folderId }: RestoreNoteProps) {
//   const queryClient = useQueryClient();
//   const router = useRouter();
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [conflictNote, setConflictNote] = useState<{ id: string; title: string } | null>(null);
//   const [newNoteTitle, setNewNoteTitle] = useState("");
//   const [error, setError] = useState<string | null>(null);

//   const restoreMutation = useMutation({
//     mutationFn: () => restoreNoteById(noteId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["notes"] });
//       router.push(`/folders/${folderId}/notes/${noteId}`);
//     },
//     onError: (error: { status: number; data?: { existingNote?: { id: string; title: string } } }) => {
//       console.error("Error restoring note:", error);
//       if (error.status === 409) {
//         setConflictNote(error.data?.existingNote ?? null);
//         setDialogOpen(true);
//       } else {
//         setError("Failed to restore the note. Please try again.");
//       }
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (existingNoteId: string) => deleteNote(existingNoteId),
//     onSuccess: () => {
//       restoreMutation.mutate();
//     },
//     onError: () => {
//       setError("Failed to replace the existing note. Please try again.");
//     },
//   });

//   const updateTitleMutation = useMutation({
//     mutationFn: (title: string) => updateNote(noteId, { title }),
//     onSuccess: () => {
//       restoreMutation.mutate();
//     },
//     onError: (error: { status: number; message?: string }) => {
//       if (error.status === 409) {
//         setError("A note with this title already exists. Please choose a different title.");
//       } else {
//         setError("Failed to rename the note. Please try again.");
//       }
//     },
//   });

//   const handleRestore = () => {
//     setError(null);
//     restoreMutation.mutate();
//   };

//   const handleReplace = () => {
//     if (conflictNote) {
//       deleteMutation.mutate(conflictNote.id);
//     }
//     setDialogOpen(false);
//     setNewNoteTitle("");
//   };

//   const handleRename = () => {
//     if (newNoteTitle.trim() === "") {
//       setError("Please enter a new note title.");
//       return;
//     }
//     if (newNoteTitle.trim() === conflictNote?.title) {
//       setError("The new title cannot be the same as the existing note's title.");
//       return;
//     }
//     updateTitleMutation.mutate(newNoteTitle.trim());
//     setDialogOpen(false);
//     setNewNoteTitle("");
//   };

//   const handleDialogClose = () => {
//     setDialogOpen(false);
//     setNewNoteTitle("");
//     setError(null);
//   };

//   return (
//     <Box
//       sx={{
//         flexGrow: 1,
//         width: "900px",
//         color: "white",
//         paddingX: "50px",
//         paddingY: "16px",
//         height: "100vh",
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "100%",
//         }}
//       >
//         <Image src={restoreIcon} alt="Restore Icon" />

//         <Typography
//           variant="h6"
//           sx={{
//             fontSize: "32px",
//             fontWeight: "bold",
//             mb: 1,
//           }}
//         >
//           Restore {noteTitle}
//         </Typography>

//         <Typography
//           variant="body2"
//           color="gray"
//           align="center"
//           marginBottom={2}
//         >
//           Don’t want to lose this note? It’s not too late! <br />
//           Just click the ‘Restore’ button and it will be added back to your list.
//           It’s that simple.
//         </Typography>

//         {error && (
//           <Typography color="error" sx={{ mb: 2 }}>
//             {error}
//           </Typography>
//         )}

//         <Button
//           variant="contained"
//           onClick={handleRestore}
//           disabled={restoreMutation.isPending}
//           sx={{
//             backgroundColor: "#1976D2",
//             color: "white",
//             textTransform: "none",
//             borderRadius: "6px",
//             px: 4,
//             py: 1,
//             "&:hover": {
//               backgroundColor: "#312EB5",
//             },
//           }}
//         >
//           {restoreMutation.isPending ? "Restoring..." : "Restore"}
//         </Button>
//       </Box>

//       <Dialog open={dialogOpen} onClose={handleDialogClose}>
//         <DialogTitle>Note Name Conflict</DialogTitle>
//         <DialogContent>
//           <Typography>
//             A note named {conflictNote?.title} already exists. Would you like to
//             replace it or rename the restored note?
//           </Typography>
//           <TextField
//             label="New Note Title"
//             value={newNoteTitle}
//             onChange={(e) => setNewNoteTitle(e.target.value)}
//             fullWidth
//             margin="normal"
//             helperText="Enter a new title to rename the restored note."
//           />
//           {error && (
//             <Typography color="error" sx={{ mt: 1 }}>
//               {error}
//             </Typography>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleDialogClose} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleReplace} color="error">
//             Replace
//           </Button>
//           <Button
//             onClick={handleRename}
//             color="primary"
//             disabled={!newNoteTitle.trim()}
//           >
//             Rename
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

// export default RestoreNote;


"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreNoteById, deleteNote, updateNote, updateFolder } from "@/apis/api";
import { useRouter } from "next/navigation";
import restoreIcon from "@/../public/icons/restore.svg";
import Image from "next/image";
import { AxiosError } from "axios";

interface RestoreNoteProps {
  noteId: string;
  noteTitle: string;
  folderId: string;
}

function RestoreNote({ noteId, noteTitle, folderId }: RestoreNoteProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [conflictType, setConflictType] = useState<"note" | "folder" | null>(null);
  const [conflictNote, setConflictNote] = useState<{ id: string; title: string } | null>(null);
  const [conflictFolder, setConflictFolder] = useState<{ id: string; name: string } | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const restoreMutation = useMutation({
    mutationFn: () => restoreNoteById(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      if(!conflictFolder) {
        router.push(`/folders/${folderId}/notes/${noteId}`);      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Error restoring note:", error);
      if (error.status === 409) {
        if (error.data.error === "Note name conflict") {
          setConflictType("note");
          setConflictNote(error.data.existingNote);
          setDialogOpen(true);
        } else if (error.data.error === "Folder name conflict") {
          setConflictType("folder");
          setConflictFolder(error.data.existingFolder);
          setDialogOpen(true);
        }
      } else {
        setError("Failed to restore the note. Please try again.");
      }
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (existingNoteId: string) => deleteNote(existingNoteId),
    onSuccess: () => {
      restoreMutation.mutate();
    },
    onError: () => {
      setError("Failed to replace the existing note. Please try again.");
    },
  });

  const updateNoteFolderMutation = useMutation({
    mutationFn: (newFolderId: string) => updateNote(noteId, { folderId: newFolderId }),
    onSuccess: () => {      
      restoreMutation.mutate();      
      router.push(`/folders/${conflictFolder?.id}/notes/${noteId}`);    },
    onError: () => {
      setError("Failed to move the note to the existing folder. Please try again.");
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: (updates: Partial<{ title: string; deletedat: null }>) =>
      updateNote(noteId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      restoreMutation.mutate();      
      router.push(`/folders/${conflictFolder?.id}/notes/${noteId}`); 
     
    },
    onError: (error: AxiosError) => {    //yahan change kiya h
      console.error("Update note error:", error);
      if (error.status === 409) {
        setError("A note with this title already exists. Please choose a different title.");
      } else {
        setError("Failed to update the note. Please try again.");
      }
    }
  });

  const updateFolderNameMutation = useMutation({
    mutationFn: (name: string) => updateFolder(folderId, name),
    onSuccess: () => {
      restoreMutation.mutate();
      router.push(`/folders/${folderId}/notes/${noteId}`);

    },
    onError: (error: AxiosError) => {    //yahan change kiya h
      if (error.status === 409) {
        setError("A folder with this name already exists. Please choose a different name.");
      } else {
        setError("Failed to rename the folder. Please try again.");
      }
    },
  });

  const handleRestore = () => {
    setError(null);
    restoreMutation.mutate();
  };

  const handleReplaceNote = () => {
    if (conflictNote) {
      deleteNoteMutation.mutate(conflictNote.id);
    }
    setDialogOpen(false);
    setNewNoteTitle("");
  };

  const handleAddToExistingFolder = () => {
    if (conflictFolder) {
      updateNoteFolderMutation.mutate(conflictFolder.id);
    }
    setDialogOpen(false);
    setNewFolderName("");
  };

  const handleRenameNote = () => {
    if (newNoteTitle.trim() === "") {
      setError("Please enter a new note title.");
      return;
    }
    if (newNoteTitle.trim() === conflictNote?.title) {
      setError("The new title cannot be the same as the existing note's title.");
      return;
    }
    updateNoteMutation.mutate({ title: newNoteTitle.trim() });
    setDialogOpen(false);
    setNewNoteTitle("");
  };

  const handleRenameFolder = () => {
    if (newFolderName.trim() === "") {
      setError("Please enter a new folder name.");
      return;
    }
    if (newFolderName.trim() === conflictFolder?.name) {
      setError("The new name cannot be the same as the existing folder's name.");
      return;
    }
    updateFolderNameMutation.mutate(newFolderName.trim());
    setDialogOpen(false);
    setNewFolderName("");
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewNoteTitle("");
    setNewFolderName("");
    setError(null);
    setConflictType(null);
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
        <Image src={restoreIcon} alt="Restore Icon" />

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
          variant="body2"
          color="gray"
          align="center"
          marginBottom={2}
        >
          Don’t want to lose this note? It’s not too late! <br />
          Just click the ‘Restore’ button and it will be added back to your list.
          It’s that simple.
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

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

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {conflictType === "note" ? "Note Name Conflict" : "Folder Name Conflict"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {conflictType === "note"
              ? `A note named "${conflictNote?.title}" already exists.`
              : `A folder named "${conflictFolder?.name}" already exists.`}
            Would you like to {conflictType === "note" ? "replace it or rename the restored note" : "add the note to the existing folder or rename the restored folder"}?
          </Typography>
          {conflictType === "note" ? (
            <TextField
              label="New Note Title"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              fullWidth
              margin="normal"
              helperText="Enter a new title to rename the restored note."
            />
          ) : (
            <TextField
              label="New Folder Name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              fullWidth
              margin="normal"
              helperText="Enter a new name to rename the restored folder."
            />
          )}
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={conflictType === "note" ? handleReplaceNote : handleAddToExistingFolder}
            color={conflictType === "note" ? "error" : "primary"}
          >
            {conflictType === "note" ? "Replace" : "Add to Existing Folder"}
          </Button>
          <Button
            onClick={conflictType === "note" ? handleRenameNote : handleRenameFolder}
            color="primary"
            disabled={
              conflictType === "note"
                ? !newNoteTitle.trim()
                : !newFolderName.trim()
            }
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default RestoreNote;
// "use client";

// import { Box, Button, IconButton, TextField, MenuItem } from "@mui/material";
// import React, { useState } from "react";
// import LogoSVG from "@/../public/icons/logo.svg";
// import Image from "next/image";
// import SearchIcon from "@mui/icons-material/Search";
// import { useParams, useRouter } from "next/navigation";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { createNote, getNotes } from "@/apis/api";

// interface Note {
//   id: string;
//   title: string;
// }

// function Header() {
//   const queryClient = useQueryClient();
//   const params = useParams();
//   const router = useRouter();
//   const folderId = Array.isArray(params.folderId)
//     ? params.folderId[0]
//     : params.folderId;

//   const [isSearching, setIsSearching] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchResults, setSearchResults] = useState<Note[]>([]);

//   // Mutation to create a new note
//   const mutation = useMutation({
//     mutationFn: () => {
//       if (!folderId) {
//         console.error("Folder ID is missing!");
//         return Promise.reject("Folder ID is required");
//       }
//       return createNote({
//         title: "Untitled Note",
//         content: "",
//         folderId,
//       });
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["notes", folderId] });
//     },
//     onError: (error) => {
//       console.error("Failed to create note:", error);
//     },
//   });

//   const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const term = e.target.value;
//     setSearchTerm(term);

//     if (term.trim() && folderId) {
//       const notes = await getNotes({
//         archived: false,
//         deleted: false,
//         search: term,
//       });
//       setSearchResults(notes);
//     } else {
//       setSearchResults([]);
//     }
//   };

//   const handleNoteSelect = (noteId: string) => {
//     router.push(`/folders/${folderId}/notes/${noteId}`);
//     setIsSearching(false);
//   };

//   return (
//     <Box
//       sx={{
//         padding: "16px",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         position: "relative",
//       }}
//       onClick={() => setIsSearching(false)}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           width: "100%",
//         }}
//       >
//         <Image src={LogoSVG} alt="Logo" />
//         <IconButton
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsSearching(true);
//           }}
//         >
//           <SearchIcon sx={{ color: "gray" }} />
//         </IconButton>
//       </Box>

//       {isSearching ? (
//         <Box
//           sx={{
//             position: "absolute",
//             top: "70px",
//             width: "90%",
//             backgroundColor: "#242424",
//             borderRadius: "4px",
//             boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
//             padding: "8px",
//             zIndex: 10,
//           }}
//           onClick={(e) => e.stopPropagation()}
//         >
//           <TextField
//             variant="outlined"
//             fullWidth
//             placeholder="Search notes..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//             autoFocus
//             sx={{
//               backgroundColor: "#242424",
//               borderRadius: "4px",
//               "& .MuiOutlinedInput-root": {
//                 color: "white", // Set text color to white
//                 "& fieldset": {
//                   borderColor: "gray", // Border color
//                 },
//                 "&:hover fieldset": {
//                   borderColor: "white", // Hover border color
//                 },
//                 "&.Mui-focused fieldset": {
//                   borderColor: "white", // Focused border color
//                 },
//               },
//               "& .MuiInputLabel-root": {
//                 color: "gray", // Placeholder color
//               },
//               "& .MuiInputLabel-root.Mui-focused": {
//                 color: "white", // Focused placeholder color
//               },
//             }}
//           />

//           {searchResults.length > 0 ? (
//             searchResults.map((note) => (
//               <MenuItem
//                 key={note.id}
//                 onMouseDown={() => handleNoteSelect(note.id)} // Prevents losing focus before selection
//               >
//                 {note.title}
//               </MenuItem>
//             ))
//           ) : (
//             <MenuItem disabled>No notes found</MenuItem>
//           )}
//         </Box>
//       ) : (
//         <Button
//           variant="contained"
//           fullWidth
//           onClick={() => mutation.mutate()}
//           sx={{
//             backgroundColor: "#242424",
//             color: "white",
//             textTransform: "none",
//             fontWeight: "bold",
//             marginTop: "12px",
//             "&:hover": { backgroundColor: "#333" },
//             padding: "10px 26px",
//           }}
//         >
//           + New Note
//         </Button>
//       )}
//     </Box>
//   );
// }

// export default Header;


"use client";

import { Box, Button, IconButton, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import React, { useState } from "react";
import LogoSVG from "@/../public/icons/logo.svg";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, getNotes } from "@/apis/api";
import { AxiosError } from "axios";

interface Note {
  id: string;
  title: string;
  folderId: string; 
}

function Header() {
  const queryClient = useQueryClient();
  const params = useParams();
  const router = useRouter();
  const folderId = Array.isArray(params.folderId)
    ? params.folderId[0]
    : params.folderId;

  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Note[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);

  // Mutation to create a new note
  const mutation = useMutation({
    mutationFn: (title: string) => {
      if (!folderId) {
        console.error("Folder ID is missing!");
        return Promise.reject("Folder ID is required");
      }
      return createNote({
        title,
        content: "",
        folderId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", folderId] });
      setDialogOpen(false);
      setNoteTitle("");
      setTitleError(null);
    },
    onError: (error: AxiosError) => {
          console.error("Error creating note:", error);
          const errorMessage = error.response?.status === 409
            ? "A note with this name already exists."
            : "Failed to create note. Please try again.";
          alert(errorMessage);
        },
  });

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() && folderId) {
      const notes = await getNotes({
        archived: false,
        deleted: false,
        search: term,
      });
      setSearchResults(notes);
    } else {
      setSearchResults([]);
    }
  };

  const handleNoteSelect = (noteId: string, folderId: string) => {
    router.push(`/folders/${folderId}/notes/${noteId}`);
    setIsSearching(false);
  };

  const handleCreateNote = () => {
    if (!noteTitle.trim()) {
      setTitleError("Note title cannot be empty.");
      return;
    }
    mutation.mutate(noteTitle.trim());
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNoteTitle("");
    setTitleError(null);
  };

  return (
    <Box
      sx={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
      onClick={() => setIsSearching(false)}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Image src={LogoSVG} alt="Logo" />
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            setIsSearching(true);
          }}
        >
          <SearchIcon sx={{ color: "gray" }} />
        </IconButton>
      </Box>

      {isSearching ? (
        <Box
          sx={{
            position: "absolute",
            top: "70px",
            width: "90%",
            backgroundColor: "#242424",
            borderRadius: "4px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            padding: "8px",
            zIndex: 10,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search notes..."
            value={searchTerm}
            onChange={handleSearchChange}
            autoFocus
            sx={{
              backgroundColor: "#242424",
              borderRadius: "4px",
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": {
                  borderColor: "gray",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              "& .MuiInputLabel-root": {
                color: "gray",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "white",
              },
            }}
          />

          {searchResults.length > 0 ? (
            searchResults.map((note) => (
              <MenuItem
                key={note.id}
                onMouseDown={() => handleNoteSelect(note.id, note.folderId)}
              >
                {note.title}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No notes found</MenuItem>
          )}
        </Box>
      ) : (
        <Button
          variant="contained"
          fullWidth
          onClick={() => setDialogOpen(true)}
          sx={{
            backgroundColor: "#242424",
            color: "white",
            textTransform: "none",
            fontWeight: "bold",
            marginTop: "12px",
            "&:hover": { backgroundColor: "#333" },
            padding: "10px 26px",
          }}
        >
          + New Note
        </Button>
      )}

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Create New Note</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Note Title"
            fullWidth
            value={noteTitle}
            onChange={(e) => {
              setNoteTitle(e.target.value);
              setTitleError(null);
            }}
            error={!!titleError}
            helperText={titleError}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "black",
                "& fieldset": {
                  borderColor: "gray",
                },
                "&:hover fieldset": {
                  borderColor: "black",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                },
              },
              "& .MuiInputLabel-root": {
                color: "gray",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "black",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleCreateNote}
            color="primary"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Header;
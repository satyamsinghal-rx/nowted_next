import {
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";
import React, { useCallback, useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNote, favoriteNote, archiveNote, deleteNote } from "@/apis/api";
import { usePathname, useRouter } from "next/navigation";
import { Folder } from "@/types/type";
import menuIcon from "@/../public/icons/menu.svg";
import Image from "next/image";
import calendarIcon from "@/../public/icons/calendar.svg";
import folderIcon from "@/../public/icons/folderIcon.svg";
import deleteIcon from "@/../public/icons/dustbin.svg";
import favoriteIcon from "@/../public/icons/favorite.svg";
import archiveIcon from "@/../public/icons/archived.svg";
import { AxiosError } from "axios";

interface NoteHeaderProps {
  noteId: string;
  initialTitle: string;
  date: string;
  folder: string;
  folderId: string;
  isFavorite: boolean;
  isArchived: boolean;
  availableFolders?: Folder[];
}

interface Note {
  id: string;
  title?: string;
  folderId?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
}

function NoteHeader({
  noteId,
  initialTitle,
  date,
  folder: initialFolder,
  folderId: initialFolderId,
  isFavorite: initialIsFavorite,
  isArchived: initialIsArchived,
  availableFolders,
}: NoteHeaderProps) {
  const [title, setTitle] = useState(initialTitle);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [folderAnchorEl, setFolderAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isArchived, setIsArchived] = useState(initialIsArchived);
  const [folder, setFolder] = useState(initialFolder);
  const [currentFolderId, setCurrentFolderId] = useState(initialFolderId);
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
    setIsArchived(initialIsArchived);
    setFolder(initialFolder);
    setCurrentFolderId(initialFolderId);
    setTitle(initialTitle);
  }, [
    initialIsFavorite,
    initialIsArchived,
    initialFolder,
    initialFolderId,
    initialTitle,
  ]);


  const updateMutation = useMutation({
    mutationFn: (note: Partial<Note>) => updateNote(noteId, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", noteId] });
    },
    onError: (error: AxiosError) => {
      console.error("Error updating note:", error);
      const errorMessage = error.response?.status === 409
          ? "A note with this name already exists."
          : "Failed to create note. Please try again.";
        alert(errorMessage);
      setTitle(initialTitle);
      setFolder(initialFolder);
      setCurrentFolderId(initialFolderId);
    },
  }); 


  const favoriteMutation = useMutation({
    mutationFn: (favorite: boolean) => favoriteNote(noteId, favorite),
    onMutate: async (favorite: boolean) => {
      setIsFavorite(favorite);
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData(["notes"]);
      queryClient.setQueryData(["notes"], (old: Note[] | undefined) => {
        if (!old) return old;
        return old.map((note) =>
          note.id === noteId ? { ...note, isFavorite: favorite } : note
        );
      });
      return { previousNotes };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error, favorite, context) => {
      console.error("Error favoriting note:", error);
      setIsFavorite(!favorite);
      queryClient.setQueryData(["notes"], context?.previousNotes);
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (archive: boolean) => archiveNote(noteId, archive),
    onMutate: async (archive: boolean) => {
      setIsArchived(archive);
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData(["notes"]);
      queryClient.setQueryData(["notes"], (old: Note[] | undefined) => {
        if (!old) return old;
        return old.map((note) =>
          note.id === noteId ? { ...note, isArchived: archive } : note
        );
      });
      return { previousNotes };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error, archive, context) => {
      console.error("Error archiving note:", error);
      setIsArchived(!archive);
      queryClient.setQueryData(["notes"], context?.previousNotes);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteNote(noteId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData(["notes"]);
      queryClient.setQueryData(["notes"], (old: Note[] | undefined) => {
        if (!old) return old;
        return old.filter((note) => note.id !== noteId);
      });
      return { previousNotes };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      if(pathname === `/folders/${currentFolderId}/notes/${noteId}`) {
        router.push(`/folders/${currentFolderId}/notes/${noteId}/restore`);
      } else if(pathname === `/favorites/notes/${noteId}`) {
        router.push(`/favorites/notes/${noteId}/restore`);
      }
    },
    onError: (error, variables, context) => {
      console.error("Error deleting note:", error);
      queryClient.setQueryData(["notes"], context?.previousNotes);
    },
  });

  const handleUpdate = useCallback(
    (newTitle: string) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeout = setTimeout(() => {
        if (newTitle !== initialTitle) {
          updateMutation.mutate({ title: newTitle, folderId: currentFolderId });
        }
      }, 1000);

      setTimeoutId(newTimeout);
    },
    [updateMutation, initialTitle, timeoutId, currentFolderId]
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTitle(newValue);
    handleUpdate(newValue);
  };

  const handleFolderChange = (newFolderId: string) => {
    const newFolder = availableFolders?.find((f) => f.id === newFolderId);
    if (newFolder) {
      setFolder(newFolder.name);
      setCurrentFolderId(newFolderId);
      updateMutation.mutate({ folderId: newFolderId });
    }

    handleFolderMenuClose();
    router.push(`/folders/${newFolderId}/notes/${noteId}`);
  };

  const handleFavorite = () => {
    favoriteMutation.mutate(!isFavorite);
    handleMenuClose();
    if (pathname.includes("favorites")) {
      router.push(`/favorites`);
    }
  };

  const handleArchive = () => {
    archiveMutation.mutate(!isArchived);
    handleMenuClose();
    if (pathname.includes("archived")) {
      router.push(`/archived`);
    } else if (pathname.includes("favorites")) {
      router.push(`/favorites`);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFolderMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFolderAnchorEl(event.currentTarget);
  };

  const handleFolderMenuClose = () => {
    setFolderAnchorEl(null);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
    handleMenuClose();
  };

  const formattedDate = new Date(date).toLocaleDateString("en-GB");

  return (
    <Box sx={{ color: "white", mb: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <TextField
          variant="standard"
          value={title}
          onChange={handleChange}
          InputProps={{
            sx: {
              color: "white",
              fontSize: "32px",
              fontWeight: "bold",
              textTransform: "uppercase",
              padding: 0,
            },
          }}
          sx={{
            flexGrow: 1,
            "& .MuiInput-underline:before": { borderBottom: "none" },
            "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
              borderBottom: "none",
            },
            "& .MuiInput-underline:after": { borderBottom: "none" },
          }}
        />
        <IconButton sx={{ color: "white" }} onClick={handleMenuOpen}>
          <Image src={menuIcon} alt="More Icon" width={36} height={36} />
        </IconButton>
      </Stack>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: "#333",
            color: "white",
            width: "300px",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        {/* Add to Favorites */}
        <MenuItem
          onClick={handleFavorite}
          sx={{ gap: 1, padding: "10px 16px" }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <Image
              src={favoriteIcon}
              alt="Favorite Icon"
              width={24}
              height={24}
            />
          </ListItemIcon>
          {isFavorite ? "Remove from favorites" : "Add to favorites"}
        </MenuItem>

        {/* Archived */}
        <MenuItem onClick={handleArchive} sx={{ gap: 1, padding: "10px 16px" }}>
          <ListItemIcon sx={{ color: "white" }}>
            <Image
              src={archiveIcon}
              alt="Archive Icon"
              width={24}
              height={24}
            />
          </ListItemIcon>
          {isArchived ? "Remove from archives" : "Archived"}
        </MenuItem>

        {/* Divider */}
        <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />

        {/* Delete */}
        <MenuItem
          onClick={handleDelete}
          sx={{ gap: 1, padding: "10px 16px", color: "#ff5555" }}
        >
          <ListItemIcon sx={{ color: "#ff5555" }}>
            <Image src={deleteIcon} alt="Delete Icon" width={24} height={24} />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>

      <Stack direction="row" alignItems="center" spacing={1} mt={2} mb={2}>
        <Image src={calendarIcon} alt="Calendar Icon" width={22} height={22} />
        <Typography
          variant="body2"
          sx={{
            color: "#A0A0A0",
            fontSize: "15px",
            paddingLeft: "10px",
            paddingRight: "40px",
          }}
        >
          Date
        </Typography>
        <Typography variant="body2" sx={{ color: "white", fontSize: "15px" }}>
          {formattedDate}
        </Typography>
      </Stack>
      <Divider sx={{ borderColor: "#FFFFFF1A" }} />
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        mt={2}
        sx={{ cursor: "pointer", "&:hover": { opacity: 0.8 } }}
      >
        <Image src={folderIcon} alt="Folder Icon" width={22} height={22} />
        <Typography
          variant="body2"
          sx={{
            color: "#A0A0A0",
            fontSize: "15px",
            paddingLeft: "10px",
            paddingRight: "40px",
          }}
        >
          Folder
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "white", fontSize: "15px" }}
          onClick={handleFolderMenuOpen}
        >
          {folder} {/* Display folder name */}
        </Typography>
      </Stack>
      <Menu
        anchorEl={folderAnchorEl}
        open={Boolean(folderAnchorEl)}
        onClose={handleFolderMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: "#333",
            color: "white",
            width: "200px",
            marginTop: "16px",
          },
        }}
      >
        {availableFolders?.map((folderOption) => (
          <MenuItem
            key={folderOption.id}
            onClick={() => handleFolderChange(folderOption.id)}
            selected={folderOption.id === currentFolderId}
          >
            {folderOption.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default NoteHeader;

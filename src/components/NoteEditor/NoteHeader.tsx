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

interface NoteHeaderProps {
  noteId: string;
  initialTitle: string;
  date: string;
  folder: string; // folder name
  folderId: string; // folder ID
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
  const [folder, setFolder] = useState(initialFolder); // folder name
  const [currentFolderId, setCurrentFolderId] = useState(initialFolderId); // folder ID
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
    setIsArchived(initialIsArchived);
    setFolder(initialFolder);
    setCurrentFolderId(initialFolderId);
  }, [initialIsFavorite, initialIsArchived, initialFolder, initialFolderId]);

  const updateMutation = useMutation({
    mutationFn: (note: Partial<Note>) => updateNote(noteId, note),
    onSuccess: (updatedNote) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      if (updatedNote.title) setTitle(updatedNote.title);
      if (updatedNote.folderId) {
        setCurrentFolderId(updatedNote.folderId);
        // Update folder name based on availableFolders
        const newFolder = availableFolders?.find(
          (f) => f.id === updatedNote.folderId
        );
        if (newFolder) setFolder(newFolder.name);
      }
    },
    onError: (error) => {
      console.error("Error updating note:", error);
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error("Error deleting note:", error);
    },
  });

  const handleUpdate = useCallback(
    (newTitle: string) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeout = setTimeout(() => {
        if (newTitle !== initialTitle) {
          updateMutation.mutate({ title: newTitle });
        }
      }, 500);

      setTimeoutId(newTimeout);
    },
    [updateMutation, initialTitle, timeoutId]
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
    router.push(`/folders/${currentFolderId}`);
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
            backgroundColor: "#333", // Dark background
            color: "white",
            width: "200px",
            borderRadius: "8px", // Rounded corners
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // Soft shadow
          },
        }}
      >
        {/* Add to Favorites */}
        <MenuItem
          onClick={handleFavorite}
          sx={{ gap: 1, padding: "10px 16px" }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <Image src={favoriteIcon} alt="Favorite Icon" width={24} height={24} />
          </ListItemIcon>
          {isFavorite ? "Remove from favorites" : "Add to favorites"}
        </MenuItem>

        {/* Archived */}
        <MenuItem onClick={handleArchive} sx={{ gap: 1, padding: "10px 16px" }}>
          <ListItemIcon sx={{ color: "white" }}>
            <Image src={archiveIcon} alt="Archive Icon" width={24} height={24} />
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
        onClick={handleFolderMenuOpen}
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
        <Typography variant="body2" sx={{ color: "white", fontSize: "15px" }}>
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

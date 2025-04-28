"use client";

import { createFolder, getFolders, deleteFolder, updateFolder } from "@/apis/api";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import FolderIconSVG from "@/../public/icons/folderIcon.svg";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useRouter, usePathname } from "next/navigation";

function FoldersList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const [newFolderName, setNewFolderName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const {
    data: folders = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["folders"],
    queryFn: getFolders,
  });

  // const createMutation = useMutation({
  //   mutationFn: createFolder,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["folders"] });
  //     setNewFolderName("");
  //     setIsAdding(false);
  //   },
  //   onError: (error) => {
  //     console.error("Error creating folder:", error);
  //     alert("Failed to create folder. Please try again.");
  //   },
  // });

    const createMutation = useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      setNewFolderName("");
      setIsAdding(false);
    },
    onError: (error: AxiosError) => {
      console.error("Error creating folder:", error);
      const errorMessage = error.response?.status === 409
        ? "A folder with this name already exists."
        : "Failed to create folder. Please try again.";
      alert(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: (error) => {
      console.error("Error deleting folder:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateFolder(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: (error: AxiosError) => {
      console.error("Error creating folder:", error);
      const errorMessage = error.response?.status === 409
        ? "A folder with this name already exists."
        : "Failed to create folder. Please try again.";
      alert(errorMessage);
    },
  });

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createMutation.mutate({ name: newFolderName.trim() });
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    deleteMutation.mutate(folderId);
    router.push("/");
  };

  if (isLoading) return <p>Loading folders...</p>;
  if (error) return <p>Error loading folders: {error.message}</p>;

  return (
    <Box
      sx={{
        maxHeight: "calc(100vh - 620px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 16px",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: "white",
            fontSize: "15px",
            fontWeight: "medium",
            paddingTop: "16px",
          }}
        >
          Folders
        </Typography>
        <IconButton
          onClick={() => setIsAdding(true)}
          sx={{
            color: "white",
            padding: "4px",
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { width: "0" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#555",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
        }}
      >
        <List>
          {isAdding && (
            <ListItem sx={{ padding: "2px 8px" }}>
              <ListItemAvatar sx={{ minWidth: 36 }}>
                <Image src={FolderIconSVG} alt="Folder Icon" />
              </ListItemAvatar>
              <TextField
                variant="standard"
                fullWidth
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateFolder();
                }}
                onBlur={() => setIsAdding(false)}
                sx={{
                  input: { color: "white" },
                  "& .MuiInput-underline:before": { borderBottomColor: "gray" },
                }}
              />
            </ListItem>
          )}

          {folders.map((folder) => (
            <ListItemButton
              key={folder.id}
              selected={pathname === `/folders/${folder.id}`}
              onClick={() => router.push(`/folders/${folder.id}`)}
              sx={{
                padding: "2px 8px",
                borderRadius: "6px",
                "&.Mui-selected": {
                  backgroundColor: "#FFFFFF08",
                  "&:hover": {
                    backgroundColor: "#FFFFFF08",
                  },
                },
                "&:hover": {
                  backgroundColor: "#FFFFFF08",
                },
              }}
            >
              <ListItem
                dense
                sx={{ padding: "2px 8px" }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFolder(folder.id);
                    }}
                  >
                    <DeleteOutlineOutlinedIcon
                      sx={{ color: "white", width: "20px" }}
                    />
                  </IconButton>
                }
              >
                <ListItemAvatar sx={{ minWidth: 36 }}>
                  <Image src={FolderIconSVG} alt="Folder Icon" />
                </ListItemAvatar>
                {editingFolderId === folder.id ? (
                  <TextField
                    variant="standard"
                    fullWidth
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        updateMutation.mutate({ id: folder.id, name: editingName });
                        setEditingFolderId(null);
                      }
                    }}
                    onBlur={() => {
                      updateMutation.mutate({ id: folder.id, name: editingName });
                      setEditingFolderId(null);
                    }}
                    autoFocus
                    sx={{
                      input: { color: "white" },
                      "& .MuiInput-underline:before": { borderBottomColor: "gray" },
                    }}
                  />
                ) : (
                  <ListItemText
                    primary={
                      <span
                        onClick={() => router.push(`/folders/${folder.id}`)}
                        onDoubleClick={() => {
                          setEditingFolderId(folder.id);
                          setEditingName(folder.name);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {folder.name}
                      </span>
                    }
                    sx={{
                      "& .MuiTypography-root": {
                        fontSize: "16px",
                        fontWeight: "medium",
                      },
                    }}
                  />
                )}
              </ListItem>
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default FoldersList;
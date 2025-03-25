"use client";

import { createFolder, getFolders, deleteFolder } from "@/apis/api"; // Added deleteFolder import
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
import { useRouter } from "next/navigation";

function FoldersList() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [newFolderName, setNewFolderName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const {
    data: folders = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["folders"],
    queryFn: getFolders,
  });

  const createMutation = useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      setNewFolderName("");
      setIsAdding(false);
    },
    onError: (error) => {
      console.error("Error creating folder:", error);
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
              sx={{ padding: "2px 8px" }}
              onClick={() => router.push(`/folders/${folder.id}`)}
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
                <ListItemText
                  primary={folder.name}
                  sx={{
                    "& .MuiTypography-root": {
                      fontSize: "16px",
                      fontWeight: "medium",
                    },
                  }}
                />
              </ListItem>
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default FoldersList;

"use client";

import { getFolders } from "@/apis/api";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Image from "next/image";
import FolderIconSVG from "@/../public/icons/folderIcon.svg";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useRouter } from "next/navigation";

function FoldersList() {

  const router = useRouter();

  const {
    data: folders = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["folders"],
    queryFn: getFolders,
  });

  if (isLoading) return <p>Loading folders...</p>;
  if (error) return <p>Error loading folders: {error.message}</p>;



  return (
    <>
      <Box
        sx={{
          maxHeight: "calc(100vh - 250px)",
          overflowY: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            width: "none",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#555",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
        }}
      >
        <List>
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
                  <IconButton edge="end" aria-label="delete">
                    <DeleteOutlineOutlinedIcon
                      sx={{ color: "white", width: "20px" }}
                    />
                  </IconButton>
                }
              >
                <ListItemAvatar sx={{ minWidth: 36 }}>
                  <Image src={FolderIconSVG} alt="Folder Icon" />
                </ListItemAvatar>
                <ListItemText primary={folder.name} />
              </ListItem>
            </ListItemButton>
          ))}
        </List>
      </Box>
    </>
  );
}

export default FoldersList;

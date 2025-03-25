"use client";

import { Box, Button, IconButton } from "@mui/material";
import React from "react";
import LogoSVG from "@/../public/icons/logo.svg";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import { usePathname } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/apis/api";

function Header() {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const folderId = pathname.split("/").pop(); 
  console.log("Folder ID:", folderId);

  const mutation = useMutation({
    mutationFn: () => {
      if (!folderId) {
        console.error("Folder ID is missing!");
        return Promise.reject("Folder ID is required");
      }
      return createNote({
        title: "Untitled Note",
        content: "",
        folderId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", folderId] });
    },
    onError: (error) => {
      console.error("Failed to create note:", error);
    },
  });
  

  return (
    <Box sx={{ padding: "16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <Image src={LogoSVG} alt="Logo" />
        <IconButton>
          <SearchIcon sx={{ color: "gray" }} />
        </IconButton>
      </Box>

      <Button
        variant="contained"
        fullWidth
        onClick={() => mutation.mutate()} 
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
    </Box>
  );
}

export default Header;

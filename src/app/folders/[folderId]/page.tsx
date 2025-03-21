"use client";

import NotesList from "@/components/NotesList/NotesList";
import React, { use } from "react";
import { getFolders, getNotes } from "@/apis/api";
import { useQuery } from "@tanstack/react-query";
import { Box } from "@mui/material";
import NoteEditor from "@/components/NoteEditor/NoteEditor";


function NotesByFolder({ params }: { params: Promise<{ folderId: string }> }) {
  const {folderId} = use(params) ;
  const folderIdNumber = folderId;

  const {
      data: folders = [],
    } = useQuery({
      queryKey: ["folders"],
      queryFn: getFolders,
    });

  const {
    data: notesByFolder = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["notes", folderId],
    queryFn: () => {
      console.log("Fetching notes for folderId:", folderIdNumber);
      return getNotes({ folderId: folderIdNumber });
    },
    enabled: !!folderIdNumber, 
  });

  if (isLoading) return <Box sx={{
    width: "320px",
    backgroundColor: "#1C1C1C",
    color: "white",
    padding: "16px",
    height: "100vh",
  }}></Box>;
  if (error) return <p>Error loading notes: {error.message}</p>;

  const getTitle = () => {
    if(folderId) {
      const folder = folders.find((folder) => folder.id === folderId);
        return folder?.name || "Select A Folder";
    } else {
      return "All Notes";
    }
  }
  const title: string = getTitle();
  
  return <>
  <NotesList notes={notesByFolder} title = {title} />
  <NoteEditor />
  
  </> ;
}

export default NotesByFolder;

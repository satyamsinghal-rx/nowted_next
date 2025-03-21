"use client";

import { getRecents } from '@/apis/api';
import { List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import React from 'react'
import Image from 'next/image';
import FolderIconSVG from "@/../public/icons/folderIcon.svg";
import { useQuery } from '@tanstack/react-query';


export default function RecentsList() {

    const {data: recents = [], error, isLoading} = useQuery({
        queryKey: ["recents"],
        queryFn: getRecents,
    });

    if (isLoading) return <p>Loading recents...</p>;
    if (error) return <p>Error loading recents: {error.message}</p>;

  return (
    
    <>
    
    <List>
      {recents.map((note) => (
        <ListItemButton key={note.id} sx={{ padding: "2px 8px" }}>
          <ListItem dense={true} sx={{ padding: "2px 8px" }}>
            <ListItemAvatar sx={{ minWidth: 32 }}> 
              <Image src={FolderIconSVG} alt="Folder Icon" />
            </ListItemAvatar>
            <ListItemText primary={note.title} />
          </ListItem>
        </ListItemButton>
      ))}
    </List>
  </>
  )
}

"use client";

import { getRecents } from "@/apis/api";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React from "react";
import Image from "next/image";
import FolderIconSVG from "@/../public/icons/folderIcon.svg";
import { useQuery } from "@tanstack/react-query"; 
import { useRouter } from "next/navigation";

export default function RecentsList() {
  const router = useRouter();
  // const pathname = usePathname();

  const {
    data: recents = [],
    error,
  } = useQuery({
    queryKey: ["recents"],
    queryFn: getRecents,
    refetchOnMount: true,

  });

  // if (isLoading) return <p>Loading recents...</p>;
  if (error) return <p>Error loading recents: {error.message}</p>;

  return (
    <>
      <List>
        {recents.map((note) => (
          <ListItemButton
            key={note.id}
            // selected={pathname.startsWith(`/folders/${note.folderId}/notes/${note.id}`)}
            sx={{
              padding: "2px 8px",
              "&.Mui-selected": {
                backgroundColor: "#312EB5",
                "&:hover": {
                  backgroundColor: "#312EB5",
                },
              },
              "&:hover": {
                backgroundColor: "#FFFFFF08",
              },
            }}
            onClick={() =>
              router.push(`/folders/${note.folderId}/notes/${note.id}`)
            }
            
          >
            <ListItem dense={true} sx={{ padding: "2px 8px" }}>
              <ListItemAvatar sx={{ minWidth: 32 }}>
                <Image src={FolderIconSVG} alt="Folder Icon" />
              </ListItemAvatar>
              <ListItemText
                primary={note.title}
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
    </>
  );
}

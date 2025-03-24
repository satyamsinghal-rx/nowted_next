import { List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material'
import React from 'react'
import Image from 'next/image'
import FolderIconSVG from "@/../public/icons/folderIcon.svg"
import { useRouter } from "next/navigation";


function MoreSection() {
  const router = useRouter();

  return (
    <>
    <Typography variant="subtitle2" sx={{ padding: "0px 16px", color: "white", marginTop: "20px" }}>
      More
    </Typography>
    <List dense={true}>
      
        <ListItemButton  sx={{ padding: "4px 8px" }}
        onClick={() => router.push(`/${"favorites"}`)}>
          <ListItem sx={{ padding: "2px 8px" }}>
            <ListItemAvatar sx={{ minWidth: 32 }}> 
              <Image src={FolderIconSVG} alt="Folder Icon" />
            </ListItemAvatar>
            <ListItemText primary="Favorites" />
          </ListItem>
        </ListItemButton>

        <ListItemButton  sx={{ padding: "2px 8px" }}
        onClick={() => router.push(`/${"trash"}`)}>
          <ListItem sx={{ padding: "2px 8px" }}>
            <ListItemAvatar sx={{ minWidth: 32 }}> 
              <Image src={FolderIconSVG} alt="Folder Icon" />
            </ListItemAvatar>
            <ListItemText primary="Trash" />
          </ListItem>
        </ListItemButton>
      
        <ListItemButton  sx={{ padding: "2px 8px" }}
        onClick={() => router.push(`/${"archived"}`)}>
          <ListItem sx={{ padding: "2px 8px" }}>
            <ListItemAvatar sx={{ minWidth: 32 }}> 
              <Image src={FolderIconSVG} alt="Folder Icon" />
            </ListItemAvatar>
            <ListItemText primary="Archived" />
          </ListItem>
        </ListItemButton>
      
      
    </List>
  </>
  )
}

export default MoreSection
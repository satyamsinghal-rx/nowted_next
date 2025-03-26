import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import deleteIcon from "@/../public/icons/dustbin.svg";
import favoriteIcon from "@/../public/icons/favorite.svg";
import archiveIcon from "@/../public/icons/archived.svg";


function MoreSection() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <Typography
        variant="subtitle2"
        sx={{
          padding: "0px 16px",
          color: "white",
          marginTop: "30px",
          fontSize: "15px",
          fontWeight: "medium",
        }}
      >
        More
      </Typography>
      <List dense={true}>
        <ListItemButton
          selected={pathname.startsWith(`/favorites`)}
          sx={{
            padding: "4px 8px",
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
          onClick={() => router.push(`/${"favorites"}`)}
        >
          <ListItem sx={{ padding: "2px 8px" }}>
            <ListItemAvatar sx={{ minWidth: 32 }}>
              <Image src={favoriteIcon} alt="Folder Icon" />
            </ListItemAvatar>
            <ListItemText
              primary="Favorites"
              sx={{
                "& .MuiTypography-root": {
                  fontSize: "16px",
                  fontWeight: "medium",
                },
              }}
            />
          </ListItem>
        </ListItemButton>

        <ListItemButton
          selected={pathname.startsWith(`/trash`)}
          sx={{
            padding: "2px 8px",
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
          onClick={() => router.push(`/${"trash"}`)}
        >
          <ListItem sx={{ padding: "2px 8px" }}>
            <ListItemAvatar sx={{ minWidth: 32 }}>
              <Image src={deleteIcon} alt="Folder Icon" />
            </ListItemAvatar>
            <ListItemText
              primary="Trash"
              sx={{
                "& .MuiTypography-root": {
                  fontSize: "16px",
                  fontWeight: "medium",
                },
              }}
            />
          </ListItem>
        </ListItemButton>

        <ListItemButton
          selected={pathname.startsWith(`/archived`)}
          sx={{
            padding: "2px 8px",
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
          onClick={() => router.push(`/${"archived"}`)}
        >
          <ListItem sx={{ padding: "2px 8px" }}>
            <ListItemAvatar sx={{ minWidth: 32 }}>
              <Image src={archiveIcon} alt="Folder Icon" />
            </ListItemAvatar>
            <ListItemText
              primary="Archived"
              sx={{
                "& .MuiTypography-root": {
                  fontSize: "16px",
                  fontWeight: "medium",
                },
              }}
            />
          </ListItem>
        </ListItemButton>
      </List>
    </>
  );
}

export default MoreSection;

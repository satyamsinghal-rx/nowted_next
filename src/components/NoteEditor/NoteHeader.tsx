import { Box, IconButton, Stack, TextField, Typography } from '@mui/material'
import React, { useCallback, useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FolderIcon from '@mui/icons-material/Folder';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateNote } from '@/apis/api';


// Define the props interface
interface NoteHeaderProps {
  noteId: string;
  initialTitle: string;
  date: string;
  folder: string;
}

function NoteHeader({noteId, initialTitle, date, folder }: NoteHeaderProps) {

  const [title, setTitle] = useState(initialTitle);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();


  const mutation = useMutation({
    mutationFn: (newTitle: string) => updateNote(noteId, { title: newTitle }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    }
  });

  const handleUpdate = useCallback(
    (newTitle: string) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeout = setTimeout(() => {
        if (newTitle !== initialTitle) {
          mutation.mutate(newTitle);
        }
      }, 500);

      setTimeoutId(newTimeout);
    },
    [mutation, initialTitle, timeoutId]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTitle(newValue);
    handleUpdate(newValue);
  };

  return (
    <Box sx={{ color: "white", mb: 2 }}>

<Stack direction="row" justifyContent="space-between" alignItems="center">
        <TextField
          variant="standard"
          value={title}
          onChange={handleChange}
          InputProps={{
            sx: {
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              padding: 0,
            },
          }}
          sx={{
            flexGrow: 1, // Allows the TextField to take available space
            '& .MuiInput-underline:before': { borderBottom: 'none' }, // Removes default underline
            '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
            '& .MuiInput-underline:after': { borderBottom: 'none' },
          }}
        />
        <IconButton sx={{ color: 'white' }}>
          <MoreVertIcon />
        </IconButton>
      </Stack>


      <Stack direction="row" alignItems="center" spacing={1} mt={2}>
        <CalendarTodayIcon sx={{ fontSize: 18, color: "#A0A0A0" }} />
        <Typography variant="body2" sx={{ color: "#A0A0A0" }}>Date</Typography>
        <Typography variant="body2" sx={{ color: "white" }}>{date}</Typography>
      </Stack>


      <Stack direction="row" alignItems="center" spacing={1} mt={1}>
        <FolderIcon sx={{ fontSize: 18, color: "#A0A0A0" }} />
        <Typography variant="body2" sx={{ color: "#A0A0A0" }}>Folder</Typography>
        <Typography variant="body2" sx={{ color: "white" }}>{folder}</Typography>
      </Stack>
    </Box>
  )
}

export default NoteHeader
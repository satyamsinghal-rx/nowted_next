import React, { useState, useEffect } from 'react';
import { Avatar, Menu, MenuItem, Typography, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/navigation';

function ProfileSection() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  interface User {
    name: string;
    avatar: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        const data = await response.json();
        setUser(data.user);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Unauthorized');
        setLoading(false);

      }
    };

    fetchUser();
  }, [router]);

  const handleAvatarClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/');
      window.location.reload();
    } catch (err) {
      console.error('Logout error:', err);
    }
    handleClose();
  };

  if (loading) {
    return (
      <Box sx={{ position: 'fixed', bottom: 16, left: 16, zIndex: 1200 }}>
        <Avatar sx={{ width: 40, height: 40 }} />
      </Box>
    );
  }

  if (error || !user) {
    return null; 
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        zIndex: 1200,
      }}
    >
      <IconButton
        onClick={handleAvatarClick}
        sx={{ p: 0 }}
        aria-controls={open ? 'profile-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar
          alt={user.name}
          src={user.avatar}
          sx={{ width: 40, height: 40 }}
        />
      </IconButton>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 200,
            mt: -1,
          },
        }}
      >
        <MenuItem disabled sx={{ opacity: 1, py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {user.name}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
          <Typography variant="body2" color="error">
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default ProfileSection;
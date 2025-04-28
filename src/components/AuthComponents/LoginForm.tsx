"use client";

import { Button, Container, TextField, Typography, Link, Box } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", { email, password });

      if (res.status === 200) {
        router.push("/");
        window.location.href = "/";
      } else {
        setError("Invalid credentials");
      }
    } catch (err: unknown) {    
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.error || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
      <Box
        sx={{
          mt: 10,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          bgcolor: "#FFFFFF",
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Log-In
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: "#3b82f6", ":hover": { backgroundColor: "#2563eb" } }}
          >
            Log-In
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" underline="hover" sx={{ color: "purple", fontWeight: 600 }}>
            Sign-Up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginForm;

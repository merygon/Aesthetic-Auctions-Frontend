"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useApiManager } from "@/hooks/useApiManager";
import HeaderSimple from "@/components/Header/HeaderLR";
import VideoBackground from "@/app/login/partials/Login/partials/VideoBackground/VideoBackGround";

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { post } = useApiManager();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setErrorMsg(
        "Las contraseñas nuevas no coinciden. Por favor, revisa el campo 'Nueva contraseña' y 'Confirmar contraseña'."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://backend-app-aesthetic-5.onrender.com/api/users/change-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            old_password: currentPassword,
            new_password: newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error en la respuesta:", errorText);
        throw new Error(`Error en la petición: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        alert("Contraseña cambiada exitosamente.");
        router.push("/login");
      } else {
        setErrorMsg("Error: " + (data.message || "Respuesta desconocida."));
      }
    } catch (error) {
      console.error(
        "Error al cambiar la contraseña (su nueva contraseña no cumple con los requisitos, pruebe a poner diferentes caracteres mayusculas o a aumentar la longitud a más de 8 caracteres):",
        error
      );
      setErrorMsg(
        "Error al cambiar la contraseña (su nueva contraseña no cumple con los requisitos, pruebe a poner diferentes caracteres mayusculas o a aumentar la longitud a más de 8 caracteres): " +
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderSimple />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Cambiar Contraseña
          </Typography>
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}
          <form onSubmit={handlePasswordChange}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Contraseña Actual"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Nueva Contraseña"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Confirmar Nueva Contraseña"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Cambiar Contraseña"
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default ChangePasswordPage;

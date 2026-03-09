"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";

import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Link from "next/link";


const login = async (user, pass) => {
  try {
    const response = await fetch(
      "https://backend-app-aesthetic-5.onrender.com/api/token/",
      //"http://localhost:8000/api/token/",
      {
        method: "POST",
        body: JSON.stringify({
          username: user,
          password: pass,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      const errorMessage = data.detail || data.non_field_errors?.[0] || "Error en la autenticación";
      throw new Error(errorMessage);
    }
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    return data;
  } catch (error) {
    console.error("Error en la autenticación:", error.message);
    throw error;
  }
};

export default function FormLogin() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = new FormData(e.currentTarget);
      const user = data.get("user");
      const passwd = data.get("passwd");

      if (!user || !passwd) {
        setError("Por favor, completa todos los campos");
        return;
      }

      const result = await login(user, passwd);

      if (result) {
        console.log("Inicio de sesión exitoso");
        router.push("/user");
      } 
    } catch (error) {
        setError(error.message ||"Usuario o contraseña incorrectos");
      }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>

      <label htmlFor="user">Usuario</label>
      <TextField id="user" type="text"  name="user" label="Usuario" placeholder="Introduce tu usuario" required/>
      
      <label htmlFor="passwd">Password</label>
      <TextField id="passwd" type="password"  name="passwd" label="Password" autoComplete="current-password" placeholder="Introduce tu contraseña" required/>

      <button type="submit" className={styles.button}>LogIn</button>

      <p>
        No tienes cuenta? <Link href="/register">Regístrate</Link>
      </p>
    </form>
  );
}

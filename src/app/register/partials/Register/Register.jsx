"use client";
// usar FormData y subscribirme al evento submit
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/register/partials/Register/styles.module.css";
import TextField from '@mui/material/TextField';
import { useApiManager } from "@/hooks/useApiManager";
import { API_URL } from "@/hooks/useApiManager";

const citiesPerRegion = {
  madrid: ["madrid", "las rozas", "pozuelo", "majadahonda"],
  galicia: ["santiago", "coruña", "vigo", "ourense"],
  navarra: ["pamplona", "tudela", "estella", "alsasua"],
  valencia: ["valencia", "paterna", "torrent", "sagunto"],
  andalucia: ["sevilla", "malaga", "granada", "cordoba"],
  LaRioja: ["logroño", "calahorra", "lardero", "haro"],
};

export default function RegisterForm() {
  const [cities, setCities] = useState([]);
  const [region, setRegion] = useState("");
  const router = useRouter();
  const {get, post, put, del} = useApiManager();
  
  useEffect(() => {
    setCities(citiesPerRegion[region] || []);
  }, [region]);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^.{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData); // fromEntries: Returns an object created by key-value entries for properties and methods
    
    if (!validateEmail(data.email)) {
      alert("Correo electrónico no valido!");
      return;
    }

    if (!validatePassword(data.password)) {
      alert("La contraseña debe tener al menos 8 dígitos");
      return;
    }

    if (data.password !== data.passwordConfirm) {
      alert("Las contraseñas no coinciden!");
      return;
    }

    const userData = {
      username: data.name,
      email: data.email,
      birth_date: data.dateOfBirth,
      locality: data.region,
      municipality: data.city,
      password: data.password,
    };

    try {
      const respose = await post("api/users/register/", userData);
      alert("Usuario registrado correctamente!");
      router.push("/login");
    } catch (error) {
      alert(`Error al registrar el usuario: ${responseData.detail || responseData.message || "Error desconocido"}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="name">Nombre</label>
        <TextField
          id="name"
          name="name"
          label="Required"
          placeholder="Introduce tu nombre"
          size="small"
          required
        />

        <label htmlFor="dateOfBirth">Fecha de nacimiento</label>
        <TextField
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          size="small"
          required
        />

        <label htmlFor="region">Región</label>
        <select className={styles.mySelect}
          id="region"
          name="region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          required
        >
          <option value="">Selecciona una región</option>
          {Object.keys(citiesPerRegion).map((regionItem) => (
            <option key={regionItem} value={regionItem}>
              {regionItem}
            </option>
          ))}
        </select>

        <label htmlFor="city">Ciudad</label>
        <select className={styles.mySelect} id="city" name="city" required disabled={!region}>
          <option value="">Selecciona una ciudad</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <label htmlFor="email">Correo</label>
        <TextField
          id="email"
          name="email"
          label="Required"
          placeholder="Introduce tu correo"
          size="small"
          required
        />

        <label htmlFor="password">Contraseña</label>
        <TextField
          id="password"
          name="password"
          type="password"
          label="Password"
          autoComplete="new-password"
          placeholder="Introduce tu contraseña"
          size="small"
          required
        />

        <label htmlFor="passwordConfirm">Repetir contraseña</label>
        <TextField
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          label="Repeat Password"
          autoComplete="new-password"
          placeholder="Introduce tu contraseña de nuevo"
          size="small"
          required
        />
        <button type="submit" className={styles.button}> Submit </button>
    </form>
  );
}

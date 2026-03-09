"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./styles.module.css";

import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { useAuction } from "@/context/AuctionContext"
import { useApiManager } from "@/hooks/useApiManager"; 
import { API_URL } from "@/hooks/useApiManager"; 

import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';


export default function AuctionsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef(null);
  const { addAuction, updateAuction } = useAuction();
  const { get, post, put, del } = useApiManager();
  const auctionId = searchParams.get("id");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await get("api/subastas/categorias/");
        setCategories(Array.isArray(data.results) ? data.results : data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
        setCategories([]); // en caso de que categories no devuelva un array con las categorías
      }
    };
    fetchCategories();
  }, [get]);

  // si estamos actualizando una subasta, mostramos los datos anteriores
  useEffect(() => {
    // if (auctionId && token) 
    if (auctionId) {
      const fetchAuction = async () => {
        try {
          const auction = await get(`api/subastas/${auctionId}/`);
          if (formRef.current) {
            formRef.current.title.value = auction.title;
            formRef.current.description.value = auction.description;
            formRef.current.price.value = auction.price;
            formRef.current.closing_date.value = auction.closing_date.split("T")[0];
            formRef.current.stock.value = auction.stock;
            formRef.current.brand.value = auction.brand;
            formRef.current.thumbnail.value = auction.thumbnail || "";
            // formRef.current.rating.value = auction.rating || "1";
            formRef.current.status.value = auction.status || "open";
            formRef.current.category.value = auction.category || "";
          }
        } catch (error) {
          console.error("Error al obtener la subasta:", error);
        }
      };
      fetchAuction();
    }
  }, [auctionId, get]);

  const validateForm = (formData) => {
    const errors = {};
    const today = new Date();
    const minClosingDate = new Date(today.setDate(today.getDate() + 15));

    // Title validation
    if (!formData.get("title") || formData.get("title").length < 3) {
      errors.title = "El título debe tener al menos 3 caracteres.";
    }
    if (formData.get("title").length > 150) {
      errors.title = "El título debe tener menos de 150 caracteres.";
    }

    // Description validation
    if (!formData.get("description") || formData.get("description").length < 10) {
      errors.description = "La descripción debe tener al menos 10 caracteres.";
    }

    // Price validation
    const price = parseFloat(formData.get("price"));
    if (isNaN(price) || price <= 0) {
      errors.price = "El precio debe ser mayor que 0.";
    }

    // Closing date validation
    const closingDate = new Date(formData.get("closing_date"));
    if (!formData.get("closing_date") || closingDate < minClosingDate) {
      errors.closing_date = "La fecha de cierre debe ser al menos 15 días en el futuro.";
    }

    // Stock validation
    const stock = parseInt(formData.get("stock"));
    if (isNaN(stock) || stock < 1) {
      errors.stock = "El stock debe ser al menos 1.";
    }

    // Brand validation
    if (!formData.get("brand") || formData.get("brand").length < 1) {
      errors.brand = "La marca es obligatoria.";
    }

    if (formData.get("brand").length > 100) {
      errors.brand = "La marca no puede exceder los 100 caracteres.";
    }

    // Thumbnail validation
    if (!formData.get("thumbnail") || formData.get("thumbnail").length > 500) {
      errors.thumbnail = "La URL debe tener menos de 500 caracteres.";
    } 

    return errors;

  }
  
  const handleReset = () => {
    if (formRef.current) {
      formRef.current.reset(); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      alert("Por favor, corrige los errores en el formulario.");
      return;
    }

    const body = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: formData.get("price"),
      closing_date: formData.get("closing_date"),
      stock: formData.get("stock"),
      brand: formData.get("brand"),
      thumbnail: formData.get("thumbnail"),
      // rating: formData.get("rating"),
      status: formData.get("status"),
      category: formData.get("category"),
    };

    // Hacemos el fetch al backend para crear la subasta
    try {
      let newAuction;
      if (auctionId) {
        newAuction = await put(`api/subastas/${auctionId}/`, body);
        updateAuction(newAuction);
        alert("¡Subasta actualizada correctamente!");
      } else {
        newAuction = await post("api/subastas/", body);
        addAuction(newAuction);
        alert("¡Subasta creada correctamente!");
      }
      router.push("/myAuctions")
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al crear la subasta");
    }
  };

  // if (!token) return null;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
      <button type="button" onClick={handleReset} className={styles.button}>
        Limpiar
      </button>

      <label htmlFor="title">Título</label>
      <TextField
        id="title"
        name="title"
        label="Title"
        size="small"
        required
        InputLabelProps={{ shrink: auctionId ? true : undefined }}
      />

      <label htmlFor="description">Descripción</label>
      <TextField
        id="description"
        name="description"
        label="Description"
        size="small"
        multiline
        rows={3}
        required
        InputLabelProps={{ shrink: auctionId ? true : undefined }}
      />

      <label htmlFor="price">Precio Inicial</label>
      <TextField
        id="price"
        name="price"
        label="Precio Inicial"
        size="small"
        type = "number"
        step = "0.001"
        required
        InputLabelProps={{ shrink: auctionId ? true : undefined }}
      />

      <label htmlFor="closing_date">Fecha límite de la subasta</label>
      <TextField
        id="closing_date"
        name="closing_date"
        type="date"
        size="small"
        required
      />

      <label htmlFor="stock">Stock</label>
      <TextField
        id="stock"
        name="stock"
        label="Stock"
        size="small"
        type = "number"
        required
        InputLabelProps={{ shrink: auctionId ? true : undefined }}
      />

      <label htmlFor="brand">Brand</label>
      <TextField
        id="brand"
        name="brand"
        label="brand"
        size="small"
        required
        InputLabelProps={{ shrink: auctionId ? true : undefined }}
      />

      <label htmlFor="thumbnail">URL imagen</label>
      <TextField
        id="thumbnail"
        name="thumbnail"
        label="thumbnail"
        size="small"
        required
        InputLabelProps={{ shrink: auctionId ? true : undefined }}
      />

      {/* <label htmlFor="rating">Calificación (0-5)</label>
      <TextField
        id="rating"
        name="rating"
        label="rating"
        type="number"
        size="small"
        min = "0"
        max = "5"
        required
        InputLabelProps={{ shrink: auctionId ? true : undefined }}
      /> */}

      <label htmlFor="status">Estado</label>
      <FormControl size="small" required>
        <InputLabel id="status-label">Estado</InputLabel>
        <Select
          labelId="status-label"
          id="status"
          name="status"
          label="Estado"
          defaultValue="open"
        >
          <MenuItem value="open">Open</MenuItem>
          <MenuItem value="close">Close</MenuItem>
        </Select>
      </FormControl>


      <label htmlFor="category">Categoría</label>
      <FormControl size="small" required>
        <InputLabel id="category-label">Categoría</InputLabel>
        <Select
          labelId="category-label"
          id="category"
          name="category"
          label="Categoría"
          defaultValue=""
        >
          <MenuItem value="">
            <em>Selecciona una categoría</em>
          </MenuItem>
          {Array.isArray(categories) && categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <button type="submit" className={styles.button}>{auctionId ? "Update Auction" : "Create Auction"}</button>
    </form>
  );
}

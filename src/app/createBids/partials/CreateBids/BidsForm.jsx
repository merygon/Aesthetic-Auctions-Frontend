"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./styles.module.css";
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { useBid } from "@/context/bidContext";
import { useApiManager } from "@/hooks/useApiManager"; 

export default function BidsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef(null);
  const { addBid, updateBid } = useBid();
  const { get, post, put, del } = useApiManager();
  
  const auctionId = searchParams.get("id");
  
  // const auctionId = searchParams.get("auctionId") || searchParams.get("id");
  const bidId = searchParams.get("bidId");

  useEffect(() => {
    if (bidId) {
      const fetchBid = async () => {
        try {
          const bidData = await get(`api/subastas/${auctionId}/pujas/${bidId}/`);
          if (formRef.current && bidData) {
            formRef.current.bid_price.value = bidData.bid_price;
          }
        } catch (error) {
          console.error("Error al obtener la puja para edición:", error);
        }
      };
      fetchBid();
    }
  }, [bidId, auctionId, get]);

  const handleReset = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const body = {
      bid_price: parseFloat(formData.get("bid_price")),
      auction: auctionId, // Este campo lo usa el backend para asociar la puja a la subasta
    };

    try {
      if (bidId) {
        // Si existe bidId, estamos actualizando la puja
        const updatedBid = await put(`api/subastas/${auctionId}/pujas/${bidId}/`, body);
        updateBid(updatedBid);
        alert("¡Puja actualizada!");
      } else {
        // Si no existe bidId, se crea una nueva puja
        const newBid = await post(`api/subastas/${auctionId}/pujas/`, body);
        addBid(newBid);
        alert("¡Puja creada!");
      }
      router.push(`/myBids`);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al procesar la puja");
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
      <button type="button" onClick={handleReset} className={styles.button}>
        Limpiar
      </button>

      <label htmlFor="bid_price">Precio Puja</label>
      <TextField
        id="bid_price"
        name="bid_price"
        label="Precio Puja"
        size="small"
        type="number"
        step="0.001"
        required
      />

      <button type="submit" className={styles.button}>
        {bidId ? "Update Bid" : "Create Bid"}
      </button>
    </form>
  );
}

"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./styles.module.css";
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { useApiManager } from "@/hooks/useApiManager"; 
import { useComment } from "@/context/commentContext";


export default function CommentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef(null);
  const {addComment, updateComment } = useComment();     
  const { get, post, put, del } = useApiManager();
  
  const auctionId = searchParams.get("auctionId") || searchParams.get("id");
  const commentId = searchParams.get("commentId");

  useEffect(() => {
    if (commentId) {
      const fetchComment = async () => {
        try {
          const commentData = await get(`api/subastas/${auctionId}/comment/${commentId}/`);
          if (formRef.current && commentData) {
            formRef.current.text.value = commentData.text;
          }
        } catch (error) {
          console.error("Error al obtener la puja para edición:", error);
        }
      };
      fetchComment();
    }
  }, [commentId, auctionId, get]);

  const handleReset = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const body = {
      //comment_text: parseFloat(formData.get("comment_text")),
      title:   formData.get("title"),
      text: formData.get("text"),
      //auction: auctionId, // Este campo lo usa el backend para asociar la puja a la subasta
    };

    try {
      if (commentId) {
        // Si existe commentId, estamos actualizando la puja
        const updatedComment = await put(`api/subastas/${auctionId}/comment/${commentId}/`, body);
        updateComment(updatedComment);
        alert("¡Puja actualizada!");
      } else {
        // Si no existe commentId, se crea una nueva puja
        const newComment = await post(`api/subastas/${auctionId}/comment/`, body);
        addComment(newComment);
        alert("¡Comentario creado!");
      }
      router.push(`/resultDetails?id=${String(auctionId)}`);
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

      <label htmlFor="title">Título</label>
      <TextField
        id="title"
        name="title"
        label="Título"
        size="big"
        required
        InputLabelProps={{ shrink: auctionId ? true : undefined }}
      />

      <label htmlFor="text">Texto comentario</label>
      <TextField
        id="text"
        name="text"
        label="Texto comentario"
        size="big"
        multiline
        rows={4}
        required
        InputLabelProps={{ shrink: auctionId ? true : undefined }}
      />

      <button type="submit" className={styles.button}>
        {commentId ? "Update Comment" : "Create Comment"}
      </button>
    </form>
  );
}

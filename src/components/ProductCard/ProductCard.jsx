"use client";

import { useEffect, useState } from "react";
import subastasData from "@/data/subastas.json";
import { TextField, Typography } from "@mui/material";
import "@/app/search/page.module.css"

export default function ProductCard( {searchQuery}) {
  // si no ha buscado nada el usuario, lo mostramos todo
  const [visibleBid, setVisibleBid] = useState([]);

  useEffect(() => {
    console.log("Subastas cargadas:", subastasData);

    if (!searchQuery?.trim()) {
      setVisibleBid(subastasData || []);
    }

    const filteredBids = (subastasData || []).filter((bid) => 
      bid.titulo?.toLowerCase().includes(searchQuery.toLowerCase())

    );
    setVisibleBid(filteredBids);
  }, [searchQuery]);

  return (
    <div className="search-results-main">
      {visibleBid.length > 0 ? (
        visibleBid.map((bid, idx) => (
          <div key = {bid.id} className="result-card">
            <img src={bid.imagen} alt = {bid.titulo} className="item-image"/>
            <div className="item-info">
            <Typography variant = "h6">{bid.titulo}</Typography>
            <Typography variant = "body2">{bid.descripcion}</Typography>
            <Typography variant = "body1">Last offer: ${bid.ultimaOferta}</Typography>
            </div>
          </div>
          ))
        ) : (
          <Typography className="no-results">
            No results found
          </Typography>
        )}
    </div>
  );
  
}
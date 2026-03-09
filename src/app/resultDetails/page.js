"use client";

import { useSearchParams } from "next/navigation";
import AuctionDetails from "@/app/resultDetails/partials/DetailsAuction/DetailsAuction";
import CommentsList from "@/app/resultDetails/partials/CommentsList/CommentsList";
import Header from "@/components/Header/Header"; // Importa tu Header
import { useState, useEffect } from "react";
import { useApiManager } from "@/hooks/useApiManager";

export default function ResultDetails() {
  const searchParams = useSearchParams();
  const auctionId = searchParams.get("id");
  const { get } = useApiManager();
  const [searchQuery, setSearchQuery] = useState("");
  const [auction, setAuction] = useState(null);

  useEffect(() => {
    if (auctionId) {
      const fetchAuction = async () => {
        try {
          const data = await get(`api/subastas/${auctionId}/`);
          setAuction(data); // .results si es necesario
        } catch (error) {
          console.error("Error al obtener la subasta:", error);
        }
      };
      fetchAuction();
    }
  }, [auctionId, get]);

  if (!auctionId) {
    return (
      <>
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <h1>Error: No se ha proporcionado un ID de subasta.</h1>
      </>
    );
  }

  if (!auction) {
    return (
      <>
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <h1>Subasta no encontrada</h1>
      </>
    );
  }

  return (
    <>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <AuctionDetails auction={auction} />
    </>
  );
}

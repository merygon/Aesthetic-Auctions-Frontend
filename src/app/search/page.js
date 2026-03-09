"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header/Header";
import styles from "./page.module.css";
import { Button, TextField, Typography } from "@mui/material";
import { useApiManager } from "@/hooks/useApiManager";
// import subastasData from "@/data/subastas.json";
// import Link from "next/link";
// import Image from "next/image";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { get } = useApiManager();
  // const initialQuery = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("texto") || ""
  );
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const auctionsPerPage = 5;

  // Obtener las subastas del backend al montar el componente
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        //const query = searchParams.toString();
        const queryString = searchParams.toString();
        const data = await get(
          `api/subastas/?${queryString}&page=${currentPage}&limit=${auctionsPerPage}`
        );

        setFilteredAuctions(data.results);
        setTotalPages(Math.ceil(data.count / auctionsPerPage));
        setHasSearched(true);
      } catch (error) {
        console.error("Error al obtener las subastas:", error);
        setFilteredAuctions([]); // en caso de que no haya subastas
        setHasSearched(true);
      }
    };
    fetchAuctions();
  }, [get, searchParams, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const timeLeft = (fechaCierre) => {
    const now = new Date();
    const endDate = new Date(fechaCierre);
    const diff = endDate - now;

    if (diff <= 0) return "Auction closed";

    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffDays}d ${diffHours}h ${diffMinutes}m`;
  };

  return (
    <div>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className={styles.searchResultsMain}>
        <h1>Search Auctions</h1>
        {filteredAuctions.length > 0
          ? filteredAuctions.map((auction) => (
              <div key={auction.id} className={styles.resultCard}>
                {auction.thumbnail && (
                  <img
                    src={auction.thumbnail}
                    alt={auction.title}
                    className={styles.itemImage}
                  />
                )}
                <div className={styles.itemInfo}>
                  <Typography variant="h6">{auction.title}</Typography>
                  <Typography variant="body2">{auction.description}</Typography>
                  <Typography variant="body1">
                    Highets Last offer: ${auction.highest_bid}
                  </Typography>
                  <Typography variant="body2">
                    Time left: {timeLeft(auction.closing_date)}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      router.push(`/resultDetails?id=${String(auction.id)}`)
                    }
                    className={styles.viewAuctionButton}
                  >
                    View Auction
                  </Button>
                </div>
              </div>
            ))
          : hasSearched && (
              <Typography className={styles.noResults}>
                No results found
              </Typography>
            )}
        {filteredAuctions.length > 0 && (
          <div className={styles.pagination}>
            <Button
              variant="outlined"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous Page
            </Button>
            <Typography variant="body2">
              Page {currentPage} of {totalPages}
            </Typography>
            <Button
              variant="outlined"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next Page
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

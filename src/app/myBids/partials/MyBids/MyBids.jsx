"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import styles from "./styles.module.css"
import { useBid } from "@/context/bidContext"
import { useApiManager } from '@/hooks/useApiManager';
import { API_URL } from "@/hooks/useApiManager";

const MyBids = () => {
    const router = useRouter();
    const { bids, setBids, deleteBid } = useBid(); 
    const { get, post, put, del } = useApiManager();
    const [token, setToken] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const bidsPerPage = 5;

    useEffect(() => {
        const sessionToken = localStorage.getItem("accessToken");
        setToken(sessionToken);
        if (!sessionToken) {
            router.push("/login");
        }
    }, [router]);
    
    useEffect(() => {
        const fetchBids = async () => {
          if (!token) return;
          try {
            const data = await get(`api/subastas/mis-pujas/?page=${currentPage}&page_size=${bidsPerPage}`);
            const userBids = Array.isArray(data.results) ? data.results : [];
            setBids(userBids);
            setTotalPages(data.count ? Math.ceil(data.count / bidsPerPage) : 1)
          } catch (error) {
            console.error("Error al obtener las pujas:", error);
            if (error.message.includes("401")) {
              router.push("/login");
            }
          }
        };
        fetchBids();
      }, [get, setBids, token, currentPage])

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    const handleUpdateBid = (bidId, auctionId) => {
        if (!token) {
            alert("Debes iniciar sesión para modificar una puja.");
            router.push("/login");
            return;
        }
        router.push(`/createBids?auctionId=${auctionId}&bidId=${bidId}`);
    }
    
    const handleDeleteBid = async (bidId, auctionId) => {
        if (!token) {
            alert("Debes iniciar sesión para eliminar una puja.");
            router.push("/login");
            return;
        }
        try {
          await del(`api/subastas/${auctionId}/pujas/${bidId}/`);
          deleteBid(bidId); // Eliminar del contexto local
          alert("Puja eliminada");
        } catch (error) {
          console.error("Error:", error);
          alert("Hubo un problema al eliminar la puja");
        }
    };
    

    const timeLeft = (fechaCierre) => {
        const now = new Date();
        const endDate = new Date(fechaCierre);
        const diff = endDate - now;

        if (diff <= 0) return "Auction closed";

        const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${diffDays}d ${diffHours}h ${diffMinutes}m`;
    };
    
    if (!token) return null;

    return (
        <div>
            <h2>My Bids</h2>
            <div className={styles.BidList}>
                {bids.length > 0 ? (
                bids.map((bid) => (
                    <div key={bid.id} className={styles.bidItem}>
                        <div className={styles.bidDetails}>
                            <h3>{bid.auction_title}</h3>
                            <p><strong>Puja:</strong> {bid.bid_price} EUR</p>
                            <p><strong>Tiempo restante:</strong> {timeLeft(bid.auction_closing_date)}</p>
                        </div>
                        <div className={styles.bidActions}>
                            {/* Aseguramos pasar el auction_id para formar la URL correctamente */}
                            <button onClick={() => handleDeleteBid(bid.id, bid.auction_id)} className={styles.button}>
                                Delete Bid
                            </button>
                            <button onClick={() => handleUpdateBid(bid.id, bid.auction_id)} className={styles.button}>
                                Update Bid
                            </button>
                        </div>
                    </div>
                ))
                    ) : (
                <p style={{ color: 'red' }}>No bids created.</p>
                )}
            </div>
            <div className={styles.pagination}>
                <button onClick={handlePrevPage} disabled={currentPage === 1} className={styles.button}>Previous Page</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className={styles.button}>Next Page</button>
            </div>
        </div>
    );
};

export default MyBids;
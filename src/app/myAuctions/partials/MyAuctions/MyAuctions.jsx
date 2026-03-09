"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import styles from "./styles.module.css"
import { useAuction } from "@/context/AuctionContext"
import { useBid } from "@/context/bidContext"
import { useApiManager } from '@/hooks/useApiManager';
import { API_URL } from "@/hooks/useApiManager";
import { jwtDecode } from "jwt-decode";

const MyAuctions = () => {
    const router = useRouter();
    const { auctions, setAuction, deleteAuction } = useAuction(); 
    const { get, post, put, del } = useApiManager();
    const [token, setToken] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const auctionsPerPage = 5;

    useEffect(() => {
        const sessionToken = localStorage.getItem("accessToken");
        setToken(sessionToken);
        if (!sessionToken) {
            router.push("/login");
        }
    }, [router]);

    // Obtener las subastas del backend al montar el componente
    useEffect(() => {
        if (token) {
            const fetchAuctions = async () => {
                try {
                    const data = await get(`api/subastas/users/?page=${currentPage}&page_size=${auctionsPerPage}`);
                    const auctionsArray = Array.isArray(data.results) ? data.results : [];
                    setAuction(auctionsArray);
                    setTotalPages(
                        data.count ? Math.ceil(data.count / auctionsPerPage) : 1
                      );
                } catch (error) {
                    console.error("Error al obtener las subastas:", error);
                }
            };
            fetchAuctions();
        }
    }, [token, currentPage]);

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
    
    const handleCreateAuction = () => {
        if (!token) {
            alert("Debes iniciar sesión para crear una subasta.");
            router.push("/login");
            return;
        }
        try {
            const decoded = jwtDecode(token);
            const userId = decoded.user_id;
            router.push(`/createAuctions?userId=${userId}`)
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            alert("Error con el token. Por favor, vuelve a iniciar sesión.");
            router.push("/login");
        }
    }

    const handleUpdateAuction = (id) => {
        if (!token) {
            alert("Debes iniciar sesión para modificar una subasta.");
            router.push("/login");
            return;
        }
        router.push(`/createAuctions?id=${id}`)
    }

    const handleDeleteAuction = async (id) => {
        if (!token) {
            alert("Debes iniciar sesión para eliminar una subasta.");
            router.push("/login");
            return;
        }
        try {
          await del(`api/subastas/${id}/`)
          deleteAuction(id); // Eliminar del contexto local
          alert("Subasta eliminada");
        } catch (error) {
          console.error("Error:", error);
          alert("Hubo un problema al eliminar la subasta");
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
        <div className={styles.div_space}>
            <h2>My Auctions</h2>
            <button onClick={handleCreateAuction} className={styles.button}>Crear Subasta</button>
            <div className={styles.BidList}>
                {auctions.length > 0 ? (
                    auctions.map((auction, index) => (
                        <div key={auction.id ? auction.id : `auction-${index}`} className={styles.bidItem}>
                            {auction.thumbnail && (<img src={auction.thumbnail} alt={auction.title} className={styles.bidImage} />)}
                            <div className={styles.bidDetails}>
                                <h3>{auction.title}</h3>
                                <p>{auction.description}</p>
                                <p><strong>Precio inicial:</strong> {auction.price} EUR</p>
                                <p><strong>Última puja:</strong> {auction.highest_bid} EUR</p>

                            </div>
                            <div className={styles.bidActions}>
                                <p><strong>Tiempo restante:</strong> {timeLeft(auction.closing_date)}</p>
                                <button onClick={() => handleDeleteAuction(auction.id)} className={styles.button}> Delete Auction </button>
                                <button onClick={() => handleUpdateAuction(auction.id)} className={styles.button}> Update Auction </button>
                            </div>
                        </div>
                ))
                    ) : (
                <p>No Auctions created.</p>
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

export default MyAuctions;
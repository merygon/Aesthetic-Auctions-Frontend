"use client"
import React, { useEffect } from "react"
import { useRouter } from "next/navigation";
//import styles from "@/app/resultDetails/page.module.css";
import { useState } from "react";
//import { Typography } from "@mui/material";
import styles from "./styles.module.css";
import { Button, Typography, Rating } from "@mui/material";
import { useComment } from "@/context/commentContext";
import { useApiManager } from "@/hooks/useApiManager";
import CommentsList from "@/app/resultDetails/partials/CommentsList/CommentsList"; 
// import ReactStars from "react-rating-stars-component" 

export default function AuctionDetails({auction}) {
    console.log(auction)
    const router = useRouter();
    const {get, post, put, del} = useApiManager();
    const [userRating, setUserRating] = useState({ id: null, value: null });
    const [avgRating, setAvgRating] = useState(auction.avg_rating || 1);
    const [isAutheticated, setIsAuthenticated] = useState(false);
    const [allRatings, setAllRatings] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        setIsAuthenticated(!!token);
    })

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const response = await get(`api/subastas/${auction.id}/ratings/user/`);
                setUserRating({ id: response.id || null, value: response.value || null });
                
                const updatedAuction = await get(`api/subastas/${auction.id}/`);
                setAvgRating(updatedAuction.avg_rating || 1.0);

                const allRats = await get(`api/subastas/${auction.id}/ratings/`)
                setAllRatings(allRats.results);
            } catch (error) {
                console.error("Error al obtener la calificación:", error);
                setUserRating({ id: null, value: null });
                setAvgRating(auction.avg_rating || 1.0);
                setAllRatings([]);
            }
        };
        fetchRating();
    }, [auction.id, get]);

    const handleRatingChange = async (event, newRating) => {
        if (!newRating) return;
        try {
            if (userRating.score) {
                await put(`api/subastas/${auction.id}/ratings/${userRating.id}/`, { value: newRating });
            } else {
                await post(`api/subastas/${auction.id}/ratings/`, { value: newRating });
            }
            
            const response = await get(`api/subastas/${auction.id}/ratings/user/`);
            setUserRating({ id: response.id || null, value: response.value || null });
            
            const updatedAuction = await get(`api/subastas/${auction.id}/`);
            setAvgRating(updatedAuction.avg_rating || 1.0);

            const updatedAllRats = await get(`api/subastas/${auction.id}/ratings/`)
            setAllRatings(updatedAllRats.results);
        } catch (error) {
            console.error("Error al calificar la subasta:", error);
        }
    }

    const handleDeleteRating = async () => {
        try {
            await del(`api/subastas/${auction.id}/ratings/${userRating.id}/`);
            setUserRating({ id: null, score: null });
            
            const updatedAuction = await get(`api/subastas/${auction.id}/`);
            setAvgRating(updatedAuction.average_rating || 1.0);
            
            const updatedAllRats = await get(`api/subastas/${auction.id}/ratings/`)
            setAllRatings(updatedAllRats.results);
        } catch (error) {
            console.error("Error al eliminar la calificación:", error);
        }
    }

    const handlePlaceBid = () => {
        router.push(`/createBids?id=${auction.id}`);
    };  
    
    const handleViewBids = () => {
        router.push(`/auctionBids?id=${auction.id}`);
    }

    const handlePlaceComment = () => {
        router.push(`/createComment?id=${auction.id}`);
    }

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

    return (
        <div className={styles.container}>
            <div className={styles.infoSection}>
                <Typography variant="h4">{auction.title}</Typography>
                
                <Typography variant="body1" className={styles.description}> {auction.description}</Typography>
                
                <Typography variant="h6">
                Última puja: {auction.highest_bid ? auction.highest_bid : auction.price}$
                </Typography>
                
                <Typography variant="body2" className={styles.timeLeft}>
                Time Left: {timeLeft(auction.closing_date)}
                </Typography>
                
                <Button variant="contained" color="primary" onClick={handlePlaceBid} disabled={timeLeft(auction.closing_date) === "Auction closed"} className={styles.bidButton}>
                Pujar
                </Button>
                
                <Button variant="contained" color="primary" onClick={handleViewBids} disabled={timeLeft(auction.closing_date) === "Auction closed"} className={styles.bidButton}>
                Ver Pujas
                </Button>

                <Button variant="contained" color="primary" className={styles.bidButton} onClick={handlePlaceComment}>
                Poner Comentario    
                </Button>

                <Typography variant="h6">Comentarios:</Typography>
                <CommentsList auctionId={auction.id} />

                <Typography variant="body1">Valoración promedio: {avgRating.toFixed(2)}</Typography>
                <Typography variant="body1">Tu valoración:</Typography>
                <Rating value={userRating.value || 0} onChange={handleRatingChange} size="medium" disabled={timeLeft(auction.closing_date) === "Auction closed"}/>
                {userRating.value && (
                    <Button variant="outlined" color="secondary" onClick={handleDeleteRating} disabled={timeLeft(auction.closing_date) === "Auction closed"} className={styles.bidButton}>
                        Eliminar valoración
                    </Button>
                )}
                <Typography variant = "h6">Valoraciones del resto de usuarios: </Typography>
                {allRatings.length > 0 ? (
                    allRatings.map((rating, idx) => (
                        <Typography key = {idx}>
                            Valoracion de {rating.user}: {rating.value}
                        </Typography>
                    )) 
                ) : (
                    <Typography variant="h2">No hay valoraciones para esta subasta</Typography>
                )}
            </div>
            <div className={styles.imageSection}>
                {auction.thumbnail && (
                <img src={auction.thumbnail} alt={auction.title} className={styles.mainImage} />
                )}
            </div>
        </div>
    );
}

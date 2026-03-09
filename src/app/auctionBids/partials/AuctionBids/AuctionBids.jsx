"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css"
import { Button, TextField, Typography, List, ListItem, ListItemText } from "@mui/material";
import { useBid } from "@/context/bidContext"
import { useApiManager } from '@/hooks/useApiManager';
import { API_URL } from "@/hooks/useApiManager";

const AuctionBids = () => {
    const { get, post, put, del } = useApiManager();
    const searchParams = useSearchParams();
    const auctionId = searchParams.get("id");
    // const auctionId = searchParams.get("auctionId");
    const [bids, setBids] = useState([]);

    useEffect(() => {
      if (auctionId) {
          const fetchBids = async () => {
              try {
                  const bidsData = await get(`api/subastas/${auctionId}/pujas/`);
                  console.log("Bids data:", bidsData); // Debug
                  setBids(Array.isArray(bidsData.results) ? bidsData.results : []);
              } catch (error) {
                  console.error("Error al obtener las pujas:", error);
              }
          };
          fetchBids();
      }
    }, [auctionId, get]);

    return (
        <div className={styles.container}>
          <Typography variant="h4" className={styles.title}>
            Pujas para esta subasta
          </Typography>
          {bids.length === 0 ? (
            <Typography variant="body1" className={styles.noBids}>
              No hay pujas para esta subasta.
            </Typography>
          ) : (
            <List className={styles.bidList}>
              {bids.map((bid, index) => (
                <ListItem key={index} className={styles.bidItem}>
                  <ListItemText
                    primary={`Puja: ${bid.bid_price}$`}
                    secondary={`Por: ${bid.bidder}`}
                    primaryTypographyProps={{ className: styles.bidPrimaryText }}
                    secondaryTypographyProps={{ className: styles.bidSecondaryText }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </div>
      );
    }

export default AuctionBids;
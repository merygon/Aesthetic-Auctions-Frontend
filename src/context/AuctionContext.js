"use client";

import { createContext, useState, useContext } from "react";

const AuctionsContext = createContext();

export const AuctionsProvider = ({ children }) => {
  const [auctions, setAuctions] = useState([]);

  const addAuction = (newAuction) => {
    setAuctions((prevAuctions) => {
      if (prevAuctions.some((auction) => auction.id === newAuction.id)) {
        return prevAuctions.map((auction) =>
          auction.id === newAuction.id ? newAuction : auction
        );
      }
      return [...prevAuctions, newAuction];
    });
  };

  const updateAuction = (updatedAuction) => {
    setAuctions((prevAuctions) =>
      prevAuctions.map((auction) =>
        auction.id === updatedAuction.id ? updatedAuction : auction
      )
    );
  };

  const deleteAuction = (id) => {
    setAuctions((prevAuctions) =>
      prevAuctions.filter((auction) => auction.id !== id)
    );
  };

  const setAuction = (newAuctions) => {
    setAuctions(Array.isArray(newAuctions) ? newAuctions : []);
  };

  return (
    <AuctionsContext.Provider
      value={{ auctions, addAuction, updateAuction, deleteAuction, setAuction }}
    >
      {children}
    </AuctionsContext.Provider>
  );
};

export function useAuction() {
  return useContext(AuctionsContext);
}

"use client";

import { createContext, useState, useContext } from "react";

const BidsContext = createContext();

export const BidsProvider = ({ children }) => {
  const [bids, setBids] = useState([]);

  const addBid = (newBid) => {
    setBids((prevBids) => [...prevBids, newBid]);
  };

  const updateBid = (updatedBid) => {
    setBids((prevBids) =>
      prevBids.map((bid) => (bid.id === updatedBid.id ? updatedBid : bid))
    );
  };

  const deleteBid = (id) => {
    setBids((prevBids) => prevBids.filter((bid) => bid.id !== id));
  };

  return (
    <BidsContext.Provider
      value={{ bids, addBid, updateBid, deleteBid, setBids }}
    >
      {children}
    </BidsContext.Provider>
  );
};

export function useBid() {
  return useContext(BidsContext);
}

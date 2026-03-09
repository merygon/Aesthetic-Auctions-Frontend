"use client";

import { useContext, useState, createContext } from "react";

const ratingsContext = createContext();

export const RatingsProvide = () => {
  const [ratings, setRatings] = useState([]);

  const addRating = (newRating) => {
    setRatings((prevRating) => [...prevRating, newRating]);
  };

  const updateRating = (updatedRating) => {
    setRatings((prevRating) => {
      prevRating.map((rating) =>
        rating.id === updatedRating.id ? updatedRating : rating
      );
    });
  };

  const deleteRating = (id) => {
    setRatings((prevRatings) => {
      prevRatings.filter((rating) => {
        rating.id !== id;
      });
    });
  };

  return (
    <RatingsProvide
      value={{ ratings, setRatings, addRating, updateRating, deleteRating }}
    >
      {children}
    </RatingsProvide>
  );
};

export function UseRating() {
  return useContext(ratingsContext);
}

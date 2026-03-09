"use client";
import { FaSearch } from "react-icons/fa";
import styles from "./styles.module.css";
// import { useRouter } from "next/navigation";
import { useApiManager } from "@/hooks/useApiManager";
import { API_URL } from "@/hooks/useApiManager";
import { useState, useEffect } from "react";
import { useRouter }  from "next/navigation";
// import { useSearchParams, useRouter } from "next/navigation";


export default function SearchBar({ searchQuery, setSearchQuery }) {
  // const searchParams = useSearchParams();
  const router = useRouter();
  const { get } = useApiManager();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [status, setStatus] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await get("api/subastas/categorias/");
        const categoriesList = Array.isArray(categoriesData.results)
          ? categoriesData.results
          : [];
        setCategories(categoriesList);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, [get]);

  const handleSearch = () => {
    if (minPrice && Number(minPrice) < 0) {
      alert("El precio mínimo debe ser mayor o igual a 0");
      return;
    }
    if (maxPrice && Number(maxPrice) < 0) {
      alert("El precio máximo debe ser mayor o igual a 0");
      return;
    }
    
    // Opcional: validar que el precio máximo sea mayor que el mínimo
    if (minPrice && maxPrice && Number(maxPrice) <= Number(minPrice)) {
      alert("El precio máximo debe ser mayor que el precio mínimo");
      return;
    }

    if (minRating && (Number(minRating) < 1 || Number(minRating) > 5)) {
      alert("La rating mínimo debe estar entre 1 y 5");
      return;
    }

    if (maxRating && (Number(maxRating) < 1 || Number(maxRating) > 5)) {
      alert("La rating máximo debe estar entre 1 y 5");
      return;
    }

    if (minRating && maxRating && Number(maxRating) < Number(minRating)) {
      alert("El rating máximo debe ser mayor que el rating mínimo");
      return;
    }
    
    const trimQuery = searchQuery.trim();
    setSearchQuery(trimQuery);

    const params = new URLSearchParams();
    if (trimQuery) {
      params.append("texto", trimQuery);
    }
    if (selectedCategory !== "all") {
      params.append("category", selectedCategory);
    }
    if (minPrice) {
      params.append("precioMin", minPrice);
    }
    if (maxPrice) {
      params.append("precioMax", maxPrice);
    }
    if (status) {
      params.append("status", status);
    }
    if (minRating) {
      params.append("ratingMin", minRating)
    }
    if (maxRating) {
      params.append("ratingMax", maxRating)
    }
    
    if (params.toString()) {
      router.push(`/search?${params.toString()}`);
    }

  };

  // Manejar tecla Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchBar}>
        <FaSearch className={styles.icon} onClick={handleSearch}/>
        <input
          type="text"
          placeholder="Buscar subastas..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <div className={styles.priceFilters}>
          <input
            type="number"
            placeholder="Precio mínimo"
            className={styles.priceInput}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <input
            type="number"
            placeholder="Precio máximo"
            className={styles.priceInput}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <input
            type="number"
            placeholder="Rating mínimo"
            className={styles.priceInput}
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <input
            type="number"
            placeholder="Rating máximo"
            className={styles.priceInput}
            value={maxRating}
            onChange={(e) => setMaxRating(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <select
            type="text"
            placeholder="Estado"
            className={styles.priceInput}
            value={status}
            onKeyDown={handleKeyPress}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Estado</option>
            <option value="open">Activa</option>
            <option value="closed">Cerrada</option>
          </select>
        </div>
        <select className={styles.categorySelect} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="all">Todas las categorías</option>
          {categories.map((category, index) => (
            <option key={index} value={category.name.toLowerCase()}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <button type="button" className={styles.button} onClick={handleSearch}>Search</button>
    </div>
  );
}


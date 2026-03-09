"use client";

import Link from "next/link";
import styles from "./styles.module.css";
import Image from "next/image";
import { FaUser, FaShoppingCart, FaGavel, FaBell } from "react-icons/fa"; // Iconos de usuario, carrito, subastas y notificaciones
import SearchBar from "@/components/Header/partials/SearchBar/SearchBar"; // Importar el SearchBar
import { useState, useEffect } from "react";
import { useApiManager } from "@/hooks/useApiManager";
import { API_URL } from "@/hooks/useApiManager";

export default function Header({ searchQuery, setSearchQuery }) {
  const [token, setToken] = useState(null);
  const { get } = useApiManager();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await get("api/subastas/categorias/");
        const categoriesList = Array.isArray(data.results)
          ? data.results
          : [];
        setCategories(categoriesList);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
        setCategories([]); // en caso de que categories no devuelva un array con las categorías
      }
    };
    fetchCategories();
  }, [get]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken  = localStorage.getItem("accessToken");
      setToken(storedToken );
    }
  }, []);

  return (
    <header className={styles.header}>
      {/* Barra superior */}
      <div className={styles.topHeader}>
        {!token ? (
        <div>
          <Link href="/login">
            <button className={styles.button}>Log-In</button>
          </Link>
          <Link href="/register">
            <button className={styles.button}>Sign-up</button>
          </Link>
        </div>
        ):(
          <></>
        )}
        <div className={styles.icons}>
          {!token ? (
            <></>
          ):(
            <Link href="/user"><FaUser className={styles.icon} /></Link>
          )}
          <Link href="#"><FaShoppingCart className={styles.icon} /></Link>
          <Link href="/myAuctions"><FaGavel className={styles.icon} /></Link>
          <Link href="#"><FaBell className={styles.icon} /></Link>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className={styles.mainHeader}>
        <div className={styles.logoContainer}>
          <Link href="/">
            <Image src="/logo2.png" alt="Logo" width={50} height={50}  />
          </Link>
          <div className={styles.logoText}>
            <span>Subastas</span>
            <span>Aesthetic</span>
          </div>
        </div>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Link href="/myAuctions">
        <button type="button" className={styles.button} >My Auctions</button>
        </Link>
        <Link href="/myBids">
        <button type="button" className={styles.button} >My Bids</button>
        </Link>
      </div>

      {/* Menú de categorías */}
      <nav className={styles.menuCategories}>
        {categories.map((category, index) => (
          <Link key={index} href={`/search?category=${category.name.toLowerCase()}`}>
            {category.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}


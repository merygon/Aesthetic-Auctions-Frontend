"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import Header from "@/components/Header/Header";
import { useEffect, useState } from "react";
import { useApiManager } from "@/hooks/useApiManager";
import { API_URL } from "@/hooks/useApiManager";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { get } = useApiManager();
  const [auctions, setAuctions] = useState([]);
  const [categories, setCategories] = useState([]);

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
        setCategories([]); // en caso de que categories no devuelva un array con las categorías
      }
    };
    fetchCategories();
  }, [get]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const auctionsData = await get("api/subastas/");
        const auctionsList = Array.isArray(auctionsData.results)
          ? auctionsData.results
          : [];
        setAuctions(auctionsList);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
        setAuctions([]); // en caso de que no haya subastas
      }
    };
    fetchAuctions();
  }, [get]);

  return (
    <>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className={styles.mainHomePage}>
        <section className={styles.featuredAuctions}>
          <h2>All Auctions</h2>
          <div className={styles.articlesContainer}>
            {auctions.length > 0 ? (
              auctions.map((auction) => (
                <Link
                  key={auction.id}
                  href={`/resultDetails?id=${String(auction.id)}`}
                  className={styles.articleCard}
                >
                  <div className={styles.imageContainer}>
                    {auction.thumbnail && (
                      <Image
                        src={auction.thumbnail}
                        alt={auction.title}
                        width={120}
                        height={120}
                        className={styles.bidImage}
                      />
                    )}
                  </div>
                  <p className={styles.articleTitle}>{auction.title}</p>
                  <p className={styles.articlePrice}>
                    Puja más alta: {auction.highest_bid}$
                  </p>
                </Link>
              ))
            ) : (
              <p>No hay subastas disponibles.</p>
            )}
          </div>
        </section>

        <nav className={styles.menuCategories}>
          {categories.length > 0 ? (
            categories.map((categorie, index) => (
              //<div key={index} className={styles.categoryItem}>
              <Link
                key={index}
                href={`/search?category=${categorie.name.toLowerCase()}`}
                className={styles.categoryItem}
              >
                <Image
                  key={index}
                  src={`/${categorie.name.toLowerCase()}.png`}
                  alt={categorie.name}
                  width={120}
                  height={120}
                  className={styles.roundImage}
                />
                <p className={styles.categoryName}>{categorie.name}</p>
              </Link>
              //</div>
            ))
          ) : (
            <p>No hay categorias disponibles</p>
          )}
        </nav>

        <section className={styles.decorativeImage}>
          <Image
            src="/fondo_pie_pag1.png"
            alt="Imagen decorativa"
            width={1450}
            height={500}
          />
        </section>
      </main>
    </>
  );
}

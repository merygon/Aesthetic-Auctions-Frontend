"use client";
import Link from "next/link";
// import AuctionsForm from "@/components/CreateAuctions/AuctionsForm";
import MyAuctions from "@/app/createAuctions/partials/CreateAuctions/AuctionsForm";
import styles from "@/app/createAuctions/partials/CreateAuctions/styles.module.css";
import HeaderSimple from "@/components/Header/HeaderLR";
import VideoBackground from "@/app/login/partials/Login/partials/VideoBackground/VideoBackGround";

export default function AuctionsFormPage() {
  return (
    <>
      <HeaderSimple />
      <section className={styles.mainLogin}>
        <section className={styles.leftColumn}>
          <h1>Crea tu Subasta</h1>
          <br />
          <MyAuctions />
        </section>
        <section className={styles.rightColumn}>
          <VideoBackground />{" "}
        </section>
      </section>
    </>
  );
}

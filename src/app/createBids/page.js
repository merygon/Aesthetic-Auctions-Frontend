"use client";
import Link from "next/link";
// import { useSearchParams } from "next/navigation";
import BidsForm from "@/app/createBids/partials/CreateBids/BidsForm";
import styles from "@/app/createBids/partials/CreateBids/styles.module.css";
import HeaderSimple from "@/components/Header/HeaderLR";
import VideoBackground from "@/app/login/partials/Login/partials/VideoBackground/VideoBackGround";
// import { Suspense } from "react";

export default function BidsFormPage() {
  // const searchParams = useSearchParams();
  // const auctionId = searchParams.get("id");
  return (
    <>
      <HeaderSimple />
      <section className={styles.mainLogin}>
        <section className={styles.leftColumn}>
          <h1>Crea tu Puja</h1>
          <br />
          <BidsForm />
          {/* <BidsForm /> */}
          {/* <BidsForm auctionId={auctionId} /> */}
        </section>
        <section className={styles.rightColumn}>
          <VideoBackground />{" "}
        </section>
      </section>
    </>
  );
}

"use client";
import Link from "next/link";
// import { useSearchParams } from "next/navigation";
import CommentForm from "@/app/createComment/partials/CreateComment/CommentForm";
import styles from "@/app/createComment/partials/CreateComment/styles.module.css";
import HeaderSimple from "@/components/Header/HeaderLR";
import VideoBackground from "@/app/login/partials/Login/partials/VideoBackground/VideoBackGround";
// import { Suspense } from "react";

export default function CommentsFormPage() {
  // const searchParams = useSearchParams();
  // const auctionId = searchParams.get("id");
  return (
    <>
      <HeaderSimple />
      <section className={styles.mainLogin}>
        <section className={styles.leftColumn}>
          <h1>Pon tu comentario</h1>
          <br />
          <CommentForm />
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

"use client";
import FormLogin from "@/app/login/partials/Login/Login";
import VideoBackground from "@/app/login/partials/Login/partials/VideoBackground/VideoBackGround";
import styles from "@/app/login/partials/Login/styles.module.css";
import HeaderSimple from "@/components/Header/HeaderLR";

export default function LoginPage() {
  return (
    <>
      <HeaderSimple />
      <main className={styles.mainLogin}>
        <section className={styles.leftColumn}>
          <h1>Iniciar Sesión</h1>
          <FormLogin />
        </section>
        <section className={styles.rightColumn}>
          <VideoBackground />{" "}
          {/* Si no queremos el video, eliminamos esta línea */}
        </section>
      </main>
    </>
  );
}

"use client";

import styles from "@/app/login/partials/Login/styles.module.css";

export default function VideoBackGround() {

  return (
    <video className={styles.decorativeVideo} autoPlay muted>
    <source src="/videos/fondo1.mp4" type="video/mp4"/>
    Tu navegador no soporta el video.
    </video>
  );
}

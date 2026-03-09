"use client";
// usar FormData y subscribirme al evento submit
import { useRouter } from "next/navigation";
import styles from "@/app/register/partials/Register/styles.module.css";
import HeaderSimple from "@/components/Header/HeaderLR";
import VideoBackground from "@/app/login/partials/Login/partials/VideoBackground/VideoBackGround";
import RegisterForm from "@/app/register/partials/Register/Register";

export default function FormRegister() {
  const router = useRouter(); // Hook que permite redirigir al usuario

  const handleSubmit = () => {
    router.push("/login"); // redirige al usuario a inicio sesión
  };

  return (
    <>
      <HeaderSimple />
      <main className={styles.mainRegister}>
        <section className={styles.leftColumn}>
          <h1>Registrarse</h1>
          <RegisterForm onSubmit={handleSubmit} />
        </section>
        <section className={styles.rightColumn}>
          <VideoBackground />
        </section>
      </main>
    </>
  );
}

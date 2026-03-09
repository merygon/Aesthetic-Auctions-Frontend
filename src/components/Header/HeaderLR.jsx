import Link from "next/link";
import styles from "./styles.module.css";
import Image from "next/image";
import { FaSearch , FaShoppingCart, FaGavel, FaBell } from "react-icons/fa"; // Iconos de usuario, carrito, subastas y notificaciones



export default function Header() {
    return (
      <header className={styles.header}>
        <div className={styles.SimpleHeader}>
          <div className={styles.logoContainer}>
            <Link href="/">
              <Image src="/logo2.png" alt="Logo" width={50} height={50}  />
            </Link>
            <div className={styles.logoText}>
              <span>Subastas</span>
              <span>Aesthetic</span>
            </div>
          </div>
          <div className={styles.icons}>
            <Link href="/"><FaSearch className={styles.icon}/></Link>
            <Link href="#"><FaShoppingCart className={styles.icon} /></Link>
            <Link href="/myAuctions"><FaGavel className={styles.icon} /></Link>
            <Link href="#"><FaBell className={styles.icon} /></Link>
          </div>
        </div>

      </header>
    );
  }
  
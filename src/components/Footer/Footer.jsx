import Link from "next/link";
import styles from "./styles.module.css";
import { FaInstagram, FaTwitter } from "react-icons/fa"; // Importamos los iconos

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerColumn}>
          <h3>Comprar</h3>
          <ul>
            <li>
              <Link href="#">Cómo Comprar</Link>
            </li>
          </ul>
        </div>
        <div className={styles.footerColumn}>
          <h3>Vender</h3>
          <ul>
            <li>
              <Link href="#">Cómo Vender</Link>
            </li>
          </ul>
        </div>
        <div className={styles.footerColumn}>
          <h3>Acerca de SA.</h3>
          <ul>
            <li>
              <Link href="#">Aviso Legal</Link>
            </li>
            <li>
              <Link href="#">Creadores</Link>
            </li>
            <li>
              <Link href="#">Descripción</Link>
            </li>
          </ul>
        </div>
        <div className={styles.footerColumn}>
          <h3>Comunidad</h3>
          <ul>
            <li>
              <Link href="https://www.instagram.com" target="_blank">
                <FaInstagram className={styles.icon} />
              </Link>
            </li>
            <li>
              <Link href="https://www.twitter.com" target="_blank">
                <FaTwitter className={styles.icon} />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>
          © 2025 Subastas Aesthetic Inc. Creado por David Tarrasa y María González{" "}
          <Link href="#">Privacidad</Link>,<Link href="#">Cookies</Link>
        </p>
      </div>
    </footer>
  );
}

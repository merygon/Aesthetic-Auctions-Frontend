"use client";
import styles from "./styles.module.css"


const UserDetails = ({ name, mail, address, birth_date, municipality, locality }) => {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>User Details</h2>
        <div className={styles.field}>
          <span className={styles.label}>Nombre:</span>
          <span className={styles.value}>{name}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Correo:</span>
          <span className={styles.value}>{mail}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Dirección:</span>
          <span className={styles.value}>{address}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Fecha de Nac.:</span>
          <span className={styles.value}>{birth_date}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Municipio:</span>
          <span className={styles.value}>{municipality}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Localidad:</span>
          <span className={styles.value}>{locality}</span>
        </div>
      </div>
    );
  };
  
  export default UserDetails;
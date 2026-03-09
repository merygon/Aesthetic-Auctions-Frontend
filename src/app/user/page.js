"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeaderSimple from "@/components/Header/HeaderLR";
import UserDetails from "@/app/user/partials/DetailsUser/UserDetails";
import { useApiManager } from "@/hooks/useApiManager";
import { API_URL } from "@/hooks/useApiManager";
import styles from "./page.module.css";

const UserPage = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { get, post } = useApiManager();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No se encontró el token, por favor inicie sesión.");
        router.push("/login");
        return;
      }

      try {
        const response = await get(`api/users/profile/`);
        setUserData(response);
      } catch (error) {
        console.error("Error:", error.message);
        setError(error.message);
        if (
          error.message.includes("Sesión inválida") ||
          error.message.includes("401")
        ) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          router.push("/login");
        }
      }
    };

    fetchUserData();
  }, [router, get]);

  const handleLogout = async () => {
    try {
      await post(`api/users/log-out/`);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.push("/login");
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message);
    }
  };

  const handleChangePassword = () => {
    router.push("/changePassword"); // change-password
  };

  return (
    <>
      <HeaderSimple />
      <div>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {userData ? (
          <div>
            <UserDetails
              name={userData.username}
              mail={userData.email}
              address={`${userData.locality}, ${userData.municipality}`}
              birth_date={userData.birth_date}
              municipality={userData.municipality}
              locality={userData.locality}
            />
            <div className={styles.buttonsContainer}>
              <button onClick={handleChangePassword} className={styles.button}>
                Change password
              </button>
              <button onClick={handleLogout} className={styles.button}>
                Log Out
              </button>
            </div>
          </div>
        ) : (
          !error && <p>Cargando información del usuario...</p>
        )}
      </div>
    </>
  );
};

export default UserPage;

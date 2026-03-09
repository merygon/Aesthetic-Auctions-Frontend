import { useCallback } from "react";

// export const API_URL = "http://localhost:8000/";
export const API_URL = "https://backend-app-aesthetic-5.onrender.com/";

const getHeaderWithAuth = (subdomain, method) => {
  const token = localStorage.getItem("accessToken");

  let headers = {
    "Content-Type": "application/json",
  };

  const publicEndpoints = ["api/subastas/", "api/subastas/categorias/"];

  const isPublicGet = method === "GET" && publicEndpoints.includes(subdomain);

  if (token && !isPublicGet) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const useApiManager = () => {
  const get = useCallback(async (subdomain, params) => {
    const url = new URL(`${API_URL}${subdomain}`);
    if (params) {
      Object.keys(params).forEach((key) => {
        url.searchParams.append(key, params[key]);
      });
    }
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaderWithAuth(subdomain, "GET"),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401) {
        // Token inválido, limpiar localStorage y lanzar error
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        throw new Error("Sesión inválida, por favor inicia sesión nuevamente.");
      }
      throw new Error(
        `HTTP error! Status: ${response.status}, Detail: ${
          errorData.detail || "Unknown error"
        }`
      );
    }
    const data = await response.json();
    return data;
  }, []);

  const post = useCallback(async (subdomain, body) => {
    const response = await fetch(`${API_URL}${subdomain}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: getHeaderWithAuth(subdomain, "POST"),
    });
    const data = await response.json();
    return data;
  }, []);

  const put = useCallback(async (subdomain, body) => {
    const response = await fetch(`${API_URL}${subdomain}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: getHeaderWithAuth(subdomain, "PUT"),
    });
    const data = await response.json();
    return data;
  }, []);

  const del = useCallback(async (subdomain, body) => {
    const response = await fetch(`${API_URL}${subdomain}`, {
      method: "DELETE",
      headers: getHeaderWithAuth(subdomain, "DELETE"),
    });
    // Si el estado es 204, no hay contenido
    if (response.status === 204) {
      return {};
    }
    // Intentamos leer el texto de la respuesta
    const text = await response.text();
    // Si no hay texto, retornamos un objeto vacío
    return text ? JSON.parse(text) : {};
  }, []);

  return { get, post, put, del };
};

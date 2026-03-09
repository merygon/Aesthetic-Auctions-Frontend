/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Permite cualquier hostname
        pathname: "/**", // Permite todas las rutas bajo cualquier dominio
      },
    ],
  },
};

export default nextConfig;

"use client";
import { useState } from "react";

export default function Home() {
  const [tab, setTab] = useState("inicio");

  const navStyle = (t: string): React.CSSProperties => ({
    padding: "0.6rem 1.5rem",
    cursor: "pointer",
    border: "none",
    borderBottom: tab === t ? "3px solid #2d6a4f" : "3px solid transparent",
    background: "none",
    fontSize: "1rem",
    fontWeight: tab === t ? 700 : 400,
    color: tab === t ? "#2d6a4f" : "#555",
  });

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "4rem 2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "1rem" }}>
        Deforestación en Comunidades Nativas
      </h1>

      <nav style={{ display: "flex", justifyContent: "center", gap: "1rem", borderBottom: "1px solid #ddd", marginBottom: "2rem" }}>
        <button style={navStyle("inicio")} onClick={() => setTab("inicio")}>Inicio</button>
        <button style={navStyle("mapa")} onClick={() => setTab("mapa")}>Mapa</button>
        <button style={navStyle("estadisticas")} onClick={() => setTab("estadisticas")}>Estadísticas</button>
      </nav>

      {tab === "inicio" && (
        <div>
          <p style={{ fontSize: "1.2rem", color: "#555", lineHeight: 1.7 }}>
            Esta es tu plantilla base. Está activa y lista para construir.
          </p>
          <p style={{ fontSize: "1rem", color: "#555", lineHeight: 1.7, marginTop: "1rem" }}>
            this is text paragraph test
          </p>
          <button style={{ marginTop: "2rem", padding: "0.75rem 2rem", fontSize: "1rem", backgroundColor: "#2d6a4f", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>
            Haz clic aquí
          </button>
        </div>
      )}

      {tab === "mapa" && (
        <div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 600, marginBottom: "1rem", color: "#2d6a4f" }}>Mapa</h2>
          <p style={{ fontSize: "1.1rem", color: "#555", lineHeight: 1.7 }}>
            El contenido del mapa irá aquí.
          </p>
        </div>
      )}

      {tab === "estadisticas" && (
        <div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 600, marginBottom: "1rem", color: "#2d6a4f" }}>Estadísticas</h2>
          <p style={{ fontSize: "1.1rem", color: "#555", lineHeight: 1.7 }}>
            El contenido de las estadísticas irá aquí.
          </p>
        </div>
      )}

      <p style={{ marginTop: "3rem", color: "#888", fontSize: "0.9rem" }}>
        Publicado en Vercel · Desarrollado con Next.js
      </p>
    </main>
  );
}

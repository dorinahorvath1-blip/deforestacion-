"use client";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [tab, setTab] = useState("inicio");
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", comunidad: "" });

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

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.6rem 0.9rem",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    marginTop: "0.3rem",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    textAlign: "left",
    fontWeight: 600,
    color: "#333",
    marginTop: "1rem",
  };

  const communities = [
    "Charapillo",
    "Rebalse Chazuta",
    "Alto Chazutayacu",
    "Anak Kurutuyacu",
    "Atun Pampa",
    "La Esperanza",
    "Sapaja Allpa",
    "Reforma Llakta",
    "San Jose Obrero",
    "Ankash Yaku de Achinamisa",
    "Santa Sofia",
    "Charapillo 2",
    "Nuevo Santa Rosa de Alto Chambira",
    "Santa Rosillo de Yanayacu",
    "Dos de Agosto",
    "Pishwalla Allpa (grande)",
    "Pishwalla Allpa (pequeña)",
    "Los Angeles",
  ];

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 2rem 4rem", textAlign: "center" }}>
      {/* Header with logo and title */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem", marginLeft: "-2rem" }}>
        <Image src="/logo.png" alt="Paz y Esperanza" width={150} height={120} style={{ objectFit: "contain", flexShrink: 0 }} />
        <h1 style={{ fontSize: "2rem", fontWeight: 700, textAlign: "left", color: "#1a1a1a" }}>
          Deforestación en Comunidades Nativas
        </h1>
      </div>

      <nav style={{ display: "flex", justifyContent: "center", gap: "0.5rem", borderBottom: "1px solid #ddd", marginBottom: "2rem" }}>
        <button style={navStyle("inicio")} onClick={() => setTab("inicio")}>Inicio</button>
        <button style={navStyle("mapa")} onClick={() => setTab("mapa")}>Mapa</button>
        <button style={navStyle("estadisticas")} onClick={() => setTab("estadisticas")}>Estadísticas</button>
        <button style={navStyle("suscribirse")} onClick={() => setTab("suscribirse")}>Suscribirse</button>
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

      {tab === "suscribirse" && (
        <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "left" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 600, marginBottom: "0.5rem", color: "#2d6a4f", textAlign: "center" }}>Suscribirse</h2>
          <p style={{ color: "#555", marginBottom: "1.5rem", textAlign: "center" }}>
            Completa el formulario para recibir actualizaciones.
          </p>

          <label style={labelStyle}>Nombre</label>
          <input
            style={inputStyle}
            type="text"
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
          />

          <label style={labelStyle}>Apellido</label>
          <input
            style={inputStyle}
            type="text"
            placeholder="Tu apellido"
            value={form.apellido}
            onChange={e => setForm({ ...form, apellido: e.target.value })}
          />

          <label style={labelStyle}>Correo electrónico</label>
          <input
            style={inputStyle}
            type="email"
            placeholder="tucorreo@ejemplo.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          <label style={labelStyle}>Comunidad</label>
          <select
            style={{ ...inputStyle, color: form.comunidad ? "#1a1a1a" : "#888" }}
            value={form.comunidad}
            onChange={e => setForm({ ...form, comunidad: e.target.value })}
          >
            <option value="" disabled>Selecciona una comunidad</option>
            {communities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button style={{ marginTop: "2rem", width: "100%", padding: "0.75rem", fontSize: "1rem", backgroundColor: "#2d6a4f", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>
            Suscribirse
          </button>
        </div>
      )}

      <p style={{ marginTop: "3rem", color: "#888", fontSize: "0.9rem" }}>
        Publicado en Vercel · Desarrollado con Next.js
      </p>
    </main>
  );
}

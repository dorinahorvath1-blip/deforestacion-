"use client";
import { useState } from "react";
import Image from "next/image";
import Estadisticas from "./Estadisticas";

export default function Home() {
  const [tab, setTab] = useState("inicio");
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", comunidad: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

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
        <div style={{ textAlign: "left" }}>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#2d6a4f", marginBottom: "1rem" }}>Nuestra Misión</h2>
          <p style={{ fontSize: "1.05rem", color: "#333", lineHeight: 1.8, marginBottom: "1rem" }}>
            Paz y Esperanza es una organización de derechos humanos que desde el año 1996 trabaja junto a personas, grupos y pueblos en situación de exclusión social y pobreza en el Perú, para que sean libres de distintas formas de violencia e injusticia social.
          </p>
          <p style={{ fontSize: "1.05rem", color: "#333", lineHeight: 1.8 }}>
            Inspirada en principios cristianos, promueve la institucionalidad democrática, el ejercicio y exigencia de los derechos humanos de las poblaciones en mayor situación de vulnerabilidad (mujeres, personas con discapacidad, migrantes e indígenas), de modo particular de los niños, niñas y adolescentes, mediante el desarrollo de capacidades, participación ciudadana, incidencia en políticas públicas y generación de oportunidades en la Amazonía, Andes y Costa peruana.
          </p>

          <p style={{ fontSize: "1.05rem", color: "#555", lineHeight: 1.8, marginTop: "2rem", borderTop: "1px solid #e0e0e0", paddingTop: "1.5rem" }}>
            Esta aplicación facilita el monitoreo de la deforestación en comunidades indígenas del Perú. Para explorar la situación de cada comunidad, seleccione la de su interés en la pestaña de Mapa o Estadísticas y aplique los filtros disponibles para visualizar la información relevante.
          </p>
        </div>
      )}

      {tab === "mapa" && (
        <div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 600, marginBottom: "1rem", color: "#2d6a4f" }}>Mapa</h2>
          <iframe
            src="https://peru-mapa.projects.earthengine.app/view/deforestacion-en-comunidades"
            style={{ width: "100%", height: "600px", border: "none", borderRadius: "10px" }}
            allowFullScreen
            title="Mapa de Deforestación en Comunidades Nativas"
          />
        </div>
      )}

      {tab === "estadisticas" && <Estadisticas />}

      {tab === "suscribirse" && (
        <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "left" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 600, marginBottom: "0.5rem", color: "#2d6a4f", textAlign: "center" }}>Suscribirse</h2>
          <p style={{ color: "#555", marginBottom: "1.5rem", textAlign: "center" }}>
            Completa el formulario para recibir alertas de deforestación en tu comunidad.
          </p>

          {formStatus === "success" ? (
            <div style={{ textAlign: "center", padding: "2rem", background: "#f6fbf8", borderRadius: "12px", border: "1px solid #b7e4c7" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>✅</div>
              <h3 style={{ color: "#2d6a4f", marginBottom: "0.5rem" }}>¡Suscripción exitosa!</h3>
              <p style={{ color: "#555" }}>Recibirás un correo de confirmación y serás notificado cuando se detecte deforestación en <strong>{form.comunidad}</strong>.</p>
              <button onClick={() => { setFormStatus("idle"); setForm({ nombre: "", apellido: "", email: "", comunidad: "" }); }}
                style={{ marginTop: "1.5rem", padding: "0.6rem 1.5rem", background: "#2d6a4f", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                Nueva suscripción
              </button>
            </div>
          ) : (
            <>
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

              {formStatus === "error" && (
                <p style={{ color: "#c0392b", marginTop: "0.8rem", fontSize: "0.9rem" }}>
                  Ocurrió un error al guardar tu suscripción. Por favor intenta de nuevo.
                </p>
              )}

              <button
                disabled={formStatus === "loading"}
                onClick={async () => {
                  if (!form.nombre || !form.apellido || !form.email || !form.comunidad) return;
                  setFormStatus("loading");
                  try {
                    const res = await fetch("/api/suscribir", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(form),
                    });
                    if (res.ok) {
                      setFormStatus("success");
                    } else {
                      setFormStatus("error");
                    }
                  } catch {
                    setFormStatus("error");
                  }
                }}
                style={{ marginTop: "2rem", width: "100%", padding: "0.75rem", fontSize: "1rem", backgroundColor: formStatus === "loading" ? "#95d5b2" : "#2d6a4f", color: "#fff", border: "none", borderRadius: "8px", cursor: formStatus === "loading" ? "not-allowed" : "pointer" }}>
                {formStatus === "loading" ? "Guardando..." : "Suscribirse"}
              </button>
            </>
          )}
        </div>
      )}

      <p style={{ marginTop: "3rem", color: "#888", fontSize: "0.9rem" }}>
        Publicado en Vercel · Desarrollado con Next.js
      </p>
    </main>
  );
}

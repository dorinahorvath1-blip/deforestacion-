"use client";
import { useState, useMemo } from "react";
import { deforestacionData } from "./data";

const COMUNIDADES = Object.keys(deforestacionData).sort();
const AÑOS = Array.from(
  new Set(Object.values(deforestacionData).flatMap((d) => Object.keys(d)))
).sort();

const COLORS = [
  "#2d6a4f", "#40916c", "#52b788", "#74c69d",
  "#1b4332", "#95d5b2", "#d8f3dc", "#081c15",
];

function BarChart({
  data,
  comunidades,
  yearRange,
}: {
  data: typeof deforestacionData;
  comunidades: string[];
  yearRange: [string, string];
}) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const years = AÑOS.filter((y) => y >= yearRange[0] && y <= yearRange[1]);
  const maxVal = Math.max(
    ...comunidades.flatMap((c) =>
      years.map((y) => data[c]?.[y] ?? 0)
    ),
    1
  );

  const barWidth = Math.max(8, Math.floor(560 / (years.length * Math.max(comunidades.length, 1) + years.length)));
  const groupGap = barWidth;
  const groupWidth = barWidth * comunidades.length + groupGap;
  const chartWidth = groupWidth * years.length + 60;
  const chartHeight = 300;
  const padLeft = 55;
  const padBottom = 40;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(maxVal * t));

  return (
    <div style={{ overflowX: "auto", width: "100%", position: "relative" }}>
      {tooltip && (
        <div style={{
          position: "absolute",
          left: tooltip.x,
          top: tooltip.y,
          background: "#1b4332",
          color: "#fff",
          padding: "0.3rem 0.6rem",
          borderRadius: "6px",
          fontSize: "0.8rem",
          fontWeight: 600,
          pointerEvents: "none",
          whiteSpace: "nowrap",
          transform: "translate(-50%, -110%)",
          zIndex: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}>
          {tooltip.text}
        </div>
      )}
      <svg width={Math.max(chartWidth + padLeft, 600)} height={chartHeight + padBottom + 10} style={{ display: "block" }} onMouseLeave={() => setTooltip(null)}>
        {/* Y axis ticks */}
        {yTicks.map((val) => {
          const y = chartHeight - (val / maxVal) * chartHeight;
          return (
            <g key={val}>
              <line x1={padLeft} x2={Math.max(chartWidth + padLeft, 600)} y1={y} y2={y} stroke="#e0e0e0" strokeDasharray="4 2" />
              <text x={padLeft - 6} y={y + 4} textAnchor="end" fontSize={10} fill="#888">
                {val}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {years.map((year, yi) => {
          const groupX = padLeft + yi * groupWidth + groupGap / 2;
          return (
            <g key={year}>
              {comunidades.map((com, ci) => {
                const val = data[com]?.[year] ?? 0;
                const barH = (val / maxVal) * chartHeight;
                const x = groupX + ci * barWidth;
                const y = chartHeight - barH;
                return (
                  <g key={com}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth - 1}
                      height={barH}
                      fill={COLORS[ci % COLORS.length]}
                      rx={2}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={(e) => {
                        const svg = (e.target as SVGRectElement).closest("svg")!;
                        const rect = svg.getBoundingClientRect();
                        const container = svg.parentElement!.getBoundingClientRect();
                        setTooltip({
                          x: x + barWidth / 2 + padLeft - (container.left - rect.left),
                          y: y - 4,
                          text: `${com} (${year}): ${val} ha`,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  </g>
                );
              })}
              {/* X label */}
              <text
                x={groupX + (barWidth * comunidades.length) / 2}
                y={chartHeight + 16}
                textAnchor="middle"
                fontSize={10}
                fill="#555"
              >
                {year}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line x1={padLeft} x2={padLeft} y1={0} y2={chartHeight} stroke="#ccc" />
        <line x1={padLeft} x2={Math.max(chartWidth + padLeft, 600)} y1={chartHeight} y2={chartHeight} stroke="#ccc" />

        {/* Y axis label */}
        <text
          x={12}
          y={chartHeight / 2}
          textAnchor="middle"
          fontSize={11}
          fill="#555"
          transform={`rotate(-90, 12, ${chartHeight / 2})`}
        >
          Hectáreas
        </text>
      </svg>
    </div>
  );
}

export default function Estadisticas() {
  const [selected, setSelected] = useState<string[]>([COMUNIDADES[0]]);
  const [yearStart, setYearStart] = useState(AÑOS[0]);
  const [yearEnd, setYearEnd] = useState(AÑOS[AÑOS.length - 1]);
  const [viewMode, setViewMode] = useState<"grafica" | "tabla">("grafica");

  const filteredYears = useMemo(
    () => AÑOS.filter((y) => y >= yearStart && y <= yearEnd),
    [yearStart, yearEnd]
  );

  const totalByYear = useMemo(() => {
    return filteredYears.map((y) => ({
      year: y,
      total: selected.reduce((sum, c) => sum + (deforestacionData[c]?.[y] ?? 0), 0),
    }));
  }, [selected, filteredYears]);

  const grandTotal = totalByYear.reduce((s, r) => s + r.total, 0);

  const toggleComunidad = (c: string) => {
    setSelected((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const btnBase: React.CSSProperties = {
    padding: "0.35rem 0.75rem",
    borderRadius: "4px",
    border: "2px solid #2d6a4f",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: 600,
    transition: "all 0.15s",
    marginBottom: "0.4rem",
  };

  return (
    <div style={{ textAlign: "left" }}>
      <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#2d6a4f", marginBottom: "0.4rem" }}>
        Estadísticas de Deforestación
      </h2>
      <p style={{ color: "#666", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        Seleccione una o más comunidades y el rango de años para comparar los niveles de deforestación anuales.
      </p>

      {/* Community selector */}
      <div style={{ background: "#f6fbf8", border: "1px solid #b7e4c7", borderRadius: "10px", padding: "1rem", marginBottom: "1.2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.7rem" }}>
          <span style={{ fontWeight: 700, color: "#1b4332", fontSize: "0.95rem" }}>Comunidades</span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={() => setSelected([...COMUNIDADES])} style={{ ...btnBase, background: "#2d6a4f", color: "#fff" }}>
              Todas
            </button>
            <button onClick={() => setSelected([])} style={{ ...btnBase, background: "#fff", color: "#2d6a4f" }}>
              Ninguna
            </button>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {COMUNIDADES.map((c, i) => (
            <button
              key={c}
              onClick={() => toggleComunidad(c)}
              style={{
                ...btnBase,
                background: selected.includes(c) ? COLORS[i % COLORS.length] : "#fff",
                color: selected.includes(c) ? "#fff" : "#2d6a4f",
                borderColor: COLORS[i % COLORS.length],
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Year range */}
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", marginBottom: "1.2rem", flexWrap: "wrap" }}>
        <div>
          <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "#333", marginRight: "0.5rem" }}>Desde:</label>
          <select
            value={yearStart}
            onChange={(e) => { setYearStart(e.target.value); if (e.target.value > yearEnd) setYearEnd(e.target.value); }}
            style={{ padding: "0.35rem 0.6rem", borderRadius: "6px", border: "1px solid #ccc", fontSize: "0.9rem" }}
          >
            {AÑOS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "#333", marginRight: "0.5rem" }}>Hasta:</label>
          <select
            value={yearEnd}
            onChange={(e) => { setYearEnd(e.target.value); if (e.target.value < yearStart) setYearStart(e.target.value); }}
            style={{ padding: "0.35rem 0.6rem", borderRadius: "6px", border: "1px solid #ccc", fontSize: "0.9rem" }}
          >
            {AÑOS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* View toggle */}
        <div style={{ marginLeft: "auto", display: "flex", background: "#e9f5ee", borderRadius: "8px", padding: "3px" }}>
          {(["grafica", "tabla"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              style={{
                padding: "0.35rem 1rem",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.85rem",
                background: viewMode === m ? "#2d6a4f" : "transparent",
                color: viewMode === m ? "#fff" : "#2d6a4f",
              }}
            >
              {m === "grafica" ? "📊 Gráfica" : "📋 Tabla"}
            </button>
          ))}
        </div>
      </div>

      {selected.length === 0 && (
        <p style={{ color: "#999", textAlign: "center", padding: "2rem" }}>
          Seleccione al menos una comunidad para ver los datos.
        </p>
      )}

      {selected.length > 0 && (
        <>
          {/* Summary cards */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.2rem", flexWrap: "wrap" }}>
            <div style={{ background: "#2d6a4f", color: "#fff", borderRadius: "10px", padding: "0.8rem 1.2rem", flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>Total deforestado</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>{grandTotal.toFixed(1)} <span style={{ fontSize: "0.9rem" }}>ha</span></div>
            </div>
            <div style={{ background: "#40916c", color: "#fff", borderRadius: "10px", padding: "0.8rem 1.2rem", flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>Comunidades seleccionadas</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>{selected.length}</div>
            </div>
            <div style={{ background: "#74c69d", color: "#fff", borderRadius: "10px", padding: "0.8rem 1.2rem", flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>Promedio anual</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>{filteredYears.length > 0 ? (grandTotal / filteredYears.length).toFixed(1) : "—"} <span style={{ fontSize: "0.9rem" }}>ha</span></div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.8rem" }}>
            {selected.map((c, i) => (
              <span key={c} style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", color: "#333" }}>
                <span style={{ width: 12, height: 12, borderRadius: 2, background: COLORS[COMUNIDADES.indexOf(c) % COLORS.length], display: "inline-block" }} />
                {c}
              </span>
            ))}
          </div>

          {viewMode === "grafica" && (
            <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "1rem" }}>
              <BarChart data={deforestacionData} comunidades={selected} yearRange={[yearStart, yearEnd]} />
            </div>
          )}

          {viewMode === "tabla" && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ background: "#2d6a4f", color: "#fff" }}>
                    <th style={{ padding: "0.6rem 0.8rem", textAlign: "left", borderRadius: "8px 0 0 0" }}>Año</th>
                    {selected.map((c) => (
                      <th key={c} style={{ padding: "0.6rem 0.8rem", textAlign: "right" }}>{c}</th>
                    ))}
                    <th style={{ padding: "0.6rem 0.8rem", textAlign: "right", borderRadius: "0 8px 0 0" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredYears.map((year, ri) => {
                    const rowTotal = selected.reduce((s, c) => s + (deforestacionData[c]?.[year] ?? 0), 0);
                    return (
                      <tr key={year} style={{ background: ri % 2 === 0 ? "#f6fbf8" : "#fff" }}>
                        <td style={{ padding: "0.5rem 0.8rem", fontWeight: 600, color: "#2d6a4f" }}>{year}</td>
                        {selected.map((c) => (
                          <td key={c} style={{ padding: "0.5rem 0.8rem", textAlign: "right", color: "#333" }}>
                            {deforestacionData[c]?.[year]?.toFixed(2) ?? "—"}
                          </td>
                        ))}
                        <td style={{ padding: "0.5rem 0.8rem", textAlign: "right", fontWeight: 700, color: "#1b4332" }}>
                          {rowTotal.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                  {/* Totals row */}
                  <tr style={{ background: "#d8f3dc", fontWeight: 700 }}>
                    <td style={{ padding: "0.5rem 0.8rem", color: "#1b4332" }}>TOTAL</td>
                    {selected.map((c) => {
                      const comTotal = filteredYears.reduce((s, y) => s + (deforestacionData[c]?.[y] ?? 0), 0);
                      return <td key={c} style={{ padding: "0.5rem 0.8rem", textAlign: "right", color: "#1b4332" }}>{comTotal.toFixed(2)}</td>;
                    })}
                    <td style={{ padding: "0.5rem 0.8rem", textAlign: "right", color: "#1b4332" }}>{grandTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

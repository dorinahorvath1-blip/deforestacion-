export default function Home() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "4rem 2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "1rem" }}>
        🌳 Deforestation Website
      </h1>
      <p style={{ fontSize: "1.2rem", color: "#555", lineHeight: 1.7 }}>
        This is your base template. It&apos;s live and ready to build on.
      </p>
      <p style={{ fontSize: "1rem", color: "#555", lineHeight: 1.7, marginTop: "1rem" }}>
        this is text paragraph test
      </p>
      <p style={{ marginTop: "2rem", color: "#888", fontSize: "0.9rem" }}>
        Deployed on Vercel · Built with Next.js
      </p>
    </main>
  );
}

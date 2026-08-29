import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Magazine() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/issues");
        if (!res.ok) throw new Error("Erreur API: " + res.status);

        const data = await res.json();
        setIssues(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Chargement...</div>;
  if (error) return <div style={{ padding: 24, color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Magazines</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
          marginTop: 16,
        }}
      >
        {issues.map((m) => (
          <Link
            key={m._id || m.number}
            to={`/acheter/numero/${m.number}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 12,
                opacity: m.isSoldOut ? 0.6 : 1,
              }}
            >
              <img
                src={m.image}
                alt={m.title}
                style={{ width: "100%", borderRadius: 10 }}
              />
              <h3 style={{ margin: "10px 0 6px" }}>{m.title}</h3>
              <p style={{ margin: 0 }}>{m.price} €</p>
              {m.isSoldOut && <p style={{ color: "red", marginTop: 6 }}>Épuisé</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
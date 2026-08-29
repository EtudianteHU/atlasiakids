import React from "react";
import { Link } from "react-router-dom";

export default function CancelPage() {
  return (
    <div style={{ textAlign: "center", marginTop: "80px", padding: "40px 20px" }}>
      <h1 style={{ fontSize: 48 }}>❌</h1>
      <h2>Paiement annulé</h2>
      <p style={{ marginTop: 16, fontSize: 18, color: "#555" }}>
        Votre paiement n'a pas été finalisé.
      </p>
      <p style={{ color: "#555" }}>Vous pouvez réessayer à tout moment.</p>
      <Link
        to="/panier"
        style={{
          display: "inline-block",
          marginTop: 30,
          padding: "14px 36px",
          background: "#f26f2d",
          color: "#fff",
          borderRadius: 40,
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Retour au panier
      </Link>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_URL = "http://localhost:5000";

// Fonction pour afficher le prix proprement
const formatAmount = (amount, currency = "EUR") => {
  if (typeof amount !== "number") return "";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
};

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      // 🔴 1. Si pas de session_id
      if (!sessionId) {
        setError("Identifiant de session manquant.");
        setLoading(false);
        return;
      }

      try {
        // 🔵 2. Appel backend
        const res = await fetch(`${API_URL}/api/checkout/session/${sessionId}`);
        const data = await res.json();

        // 🔴 3. erreur serveur
        if (!res.ok) {
          throw new Error(data.message || "Erreur serveur.");
        }

        // 🔴 4. paiement non validé
        if (data.payment_status !== "paid") {
          throw new Error("Le paiement n'est pas confirmé.");
        }

        // ✅ 5. paiement OK
        setSessionData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  // ⏳ LOADING
  if (loading) {
    return (
      <div style={styles.container}>
        <h2>⏳ Vérification du paiement...</h2>
      </div>
    );
  }

  // ❌ ERREUR
  if (error) {
    return (
      <div style={styles.container}>
        <h1>⚠️</h1>
        <h2>Paiement non validé</h2>
        <p>{error}</p>

        <Link to="/" style={styles.button}>
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  // ✅ SUCCESS
  return (
    <div style={styles.container}>
      <h1>✅</h1>
      <h2>Commande confirmée !</h2>

      <p>Merci pour votre achat 🎉</p>

      {sessionData?.customer_email && (
        <p>
          Email : <strong>{sessionData.customer_email}</strong>
        </p>
      )}

      {sessionData?.amount_total && (
        <p>
          Montant payé :{" "}
          <strong>
            {formatAmount(sessionData.amount_total, sessionData.currency)}
          </strong>
        </p>
      )}

      <Link to="/" style={styles.button}>
        Retour à l'accueil
      </Link>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "80px",
  },
  button: {
    marginTop: "20px",
    display: "inline-block",
    padding: "12px 30px",
    background: "#2a5da8",
    color: "#fff",
    borderRadius: "30px",
    textDecoration: "none",
  },
};
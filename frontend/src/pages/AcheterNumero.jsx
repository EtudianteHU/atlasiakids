
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AcheterNumero.css";

export default function AcheterNumero() {
  console.log("🔥 NOUVELLE VERSION AcheterNumero");

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  // Vérifie les changements de issues
  useEffect(() => {
    console.log("🔄 issues changé :", issues);
  }, [issues]);

  // Charge les magazines
  useEffect(() => {
    const loadIssues = async () => {
      const start = performance.now();

      console.log("🟢 AcheterNumero : DÉBUT");

      try {
        setLoading(true);
        setError(false);

        console.log("🌐 Appel API...");

        const apiStart = performance.now();

        const res = await fetch(
          "https://atlasiakids-backend.onrender.com/api/issues?limit=100"
        );

        console.log(
          "🌐 API réponse :",
          Math.round(performance.now() - apiStart),
          "ms"
        );

        if (!res.ok) {
          throw new Error("Erreur API");
        }

        const jsonStart = performance.now();
        const data = await res.json();

        console.log(
          "📦 JSON reçu :",
          Math.round(performance.now() - jsonStart),
          "ms"
        );

        console.log("📚 Nombre de magazines :", data.length);
        console.log("📚 Magazines :", data);
          console.log("🔎 MAG 1 :", data[0]);
         console.log("🔎 MAG 2 :", data[1]);
        setIssues(data);

        console.log(
          "⚛️ setIssues appelé :",
          Math.round(performance.now() - start),
          "ms"
        );
      } catch (err) {
        console.error("❌ API error:", err);
        setError(true);
      } finally {
        setLoading(false);

        console.log(
          "🏁 AcheterNumero FIN :",
          Math.round(performance.now() - start),
          "ms"
        );
      }
    };

    loadIssues();
  }, []);

  // Vérifie que React refait bien le rendu
  console.log("🎨 RENDER AcheterNumero :", issues);

  return (
    <div className="anPage">
      {loading && (
        <div className="anLoading">
          Chargement des magazines...
        </div>
      )}

      {error && (
        <div className="anError">
          Impossible de charger les magazines.
        </div>
      )}

      {!loading && !error && (
        <section className="anGrid">
          {issues.map((issue) => (
            <div key={issue._id} className="anCardLink">
              <div className="anCard">
                <div className="anCoverWrap">
                  <img
                    className="anCover"
                    src={issue.image}
                    alt={issue.title}
                  />

                  {issue.isSoldOut ? (
                    <div className="anSoldOutCircle">
                      <span>ÉPUISÉ</span>
                    </div>
                  ) : (
                    <button
                      className="anAddBtn"
                      onClick={() =>
                        navigate(`/acheter/numero/${issue.number}`)
                      }
                    >
                      Voir le produit
                    </button>
                  )}
                </div>

                <div className="anInfo">
                  <div className="anIssueTitle">
                    {issue.title}
                  </div>

                  <div className="anPrice">
                    {Number(issue.price).toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}


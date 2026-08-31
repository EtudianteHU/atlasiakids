import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AcheterNumero.css";

// -------------------- COMPONENT --------------------
export default function AcheterNumero() {
  const [issues, setIssues] = useState([]);
  const navigate = useNavigate(); 
  // ---------------- LOAD DATA FROM MONGODB ----------------
useEffect(() => {

  console.log("🔥 ACHETER NUMERO COMPONENT ÇALIŞIYOR");
  fetch("https://atlasiakids-backend.onrender.com/api/issues")
    .then((res) => res.json())
    .then((data) => {
      console.log("ALL ISSUES:", data); // 👈 voir tout

      data.forEach((issue) => {
        console.log("IMAGE URL:", issue.image); // 👈 ICI
      });

      setIssues(data);
    })
    .catch((err) => console.error("API error:", err));
}, []);

  // ---------------- UI ----------------
  return (
    <div className="anPage">
     
      <section className="anGrid">
        {issues.map((issue) => (
          <div key={issue._id}className="anCardLink">

            {/* CARD */}
            <div className="anCard">

              {/* IMAGE + BUTTON */}
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
  onClick={() => {
    navigate(`/acheter/numero/${issue.number}`);
  }}
>
  Voir le produit
</button>
                )}
              </div>

              {/* INFOS */}
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
    </div>
  );
}
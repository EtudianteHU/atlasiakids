import React from "react";
import { useNavigate } from "react-router-dom";
import "./JoinAdventure.css";

// ✅ Images locales (assets) — on renomme pour éviter collision
import coverLeftImg from "../images/cover-left.png";
import coverRightImg from "../images/cover-right.png";

export default function JoinAdventure({
  // ✅ Afficher les covers au début
  showCoversFirst = true,

  // ✅ Covers par défaut = imports
  leftImage = coverLeftImg,
  rightImage = coverRightImg,

  // ✅ 3 colonnes (ton JSON)
  sections = [],

  // ✅ Texte
  kicker = "Inspirez. Explorez. Grandissez. Chaque mois.",
  title = "Rejoignez l’aventure avec",
  underline = "Atlasia Kids !",
  desc = "Atlasia Kids est un magazine mensuel conçu avec amour pour les enfants de 6 à 11 ans...",
  buttonText = "Je m’abonne",
  to = "/subscribe",
}) {
  const navigate = useNavigate();

  return (
    <section className="jaSection">
      {/* ✅ Covers AU DÉBUT */}
      {showCoversFirst && (
        <div className="jaCovers jaCoversTop">
          <div className="jaCoverCard">
            <img
              className="jaCoverImg"
              src={leftImage}
              alt="Couverture Atlasia Kids"
              loading="lazy"
            />
          </div>

          <div className="jaCoverCard">
            <img
              className="jaCoverImg"
              src={rightImage}
              alt="Magazine Atlasia Kids"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* ✅ Texte + bouton */}
      <div className="jaInner">
        <p className="jaKicker">{kicker}</p>

        <h2 className="jaTitle">
          {title} <br />
          <span className="jaUnderline">{underline}</span>
        </h2>

        <p className="jaDesc">{desc}</p>

        {buttonText && (
          <button className="jaBtn" onClick={() => navigate(to)} type="button">
            {buttonText}
          </button>
        )}
      </div>

      {/* ✅ 3 colonnes */}
      {Array.isArray(sections) && sections.length > 0 && (
        <div className="jaGrid">
          {sections.map((s) => (
            <article
              key={s.id}
              className="jaPanel"
              style={{ backgroundColor: s.bgColor || "#2f6fae" }}
            >
              <div className="jaPanelInner">
                <div className="jaImgWrap">
                  <img className="jaImg" src={s.image} alt={s.title} loading="lazy" />
                </div>

                <h3 className="jaPanelTitle">{s.title}</h3>

                {Array.isArray(s.items) && s.items.length > 0 && (
                  <ul className="jaList">
                    {s.items.map((item, idx) => (
                      <li key={`${s.id}-${idx}`} className="jaListItem">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
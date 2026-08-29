import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../sections/currentIssue.css";

import kidsImg from "../images/kids.png";

export default function CurrentIssue() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect(); // ✅ Joue l'animation une seule fois
        }
      },
      { threshold: 0.25 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`ciSection ${inView ? "is-visible" : ""}`}
    >
      <div className="ciWrap">
        {/* Colonne gauche : image */}
        <div className="ciLeft ciFadeUp">
          <img className="ciKids" src={kidsImg} alt="Atlasia Kids" />
        </div>

        {/* Colonne droite : texte + barres */}
        <div className="ciRight ciFadeUp" style={{ animationDelay: "120ms" }}>
          <h2 className="ciTitle">
            <span className="ciUnderline">Numéro actuel</span>
          </h2>

          <p className="ciText">
            Chaque numéro d’Atlasia Kids est rempli d’histoires passionnantes,
            de poèmes inspirants, de contes du monde, de BD amusantes,
            de blagues, de jeux créatifs, d’illustrations colorées — et surtout,
            d’aventures pleines de foi, spécialement conçues pour les enfants!
          </p>

          <div className="ciBars">
            <Bar label="100% Fun" value={100} tone="green" animate={inView} />
            <Bar label="100% Aventure" value={100} tone="orange" animate={inView} />
            <Bar label="0% Ennui" value={0} tone="gray" animate={inView} />
          </div>

          <button
            className="ciBtn"
            type="button"
            onClick={() => navigate("/current-issue")}
          >
            Découvrir plus
          </button>
        </div>
      </div>
         {/* 🌊 WAVE */}
  <div className="current-wave" />
    </section>
  );
}

function Bar({ label, value, tone, animate }) {
  return (
    <div className="ciBar ciFadeUp" style={{ animationDelay: "220ms" }}>
      <div className="ciBarTop">
        <span className="ciBarLabel">{label}</span>
        <span className="ciBarPct">{value}%</span>
      </div>

      <div className="ciTrack">
        {/* ✅ La largeur s’anime uniquement quand animate=true */}
        <div
          className={`ciFill ciFill--${tone} ${animate ? "ciFill--go" : ""}`}
          style={{ "--target": `${value}%` }}
        />
      </div>
    </div>
  );
}
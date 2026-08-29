import React, { useState } from "react";
import { teamData } from "../data/teamData";
import "./TeamSection.css";
import bg from "../images/pattern-2.png";

export default function TeamSection() {
  const [activeId, setActiveId] = useState(null);


  return (

  <section className="team-section">
    <div className="team-grid" style={{ backgroundImage: `url(${bg})` }} ></div>
    <div className="team-grid"></div>
      <div className="team-container">
        <div className="team-header">
          <h2 className="team-title">Découvrez l'équipe derrière Atlasia Kids France</h2>
         <p className="team-subtitle">
  Découvrez notre équipe, qui a travaillé avec soin pour adapter et réadapter cette revue d’origine anglaise, afin d’offrir une version française fluide, fidèle et parfaitement adaptée à ses lecteurs.
</p>

        </div>

     <div className="team-grid">
  {teamData.map((member) => {
    const isActive = activeId === member.id;

    return (
      <article
        key={member.id}
        className={`team-card ${isActive ? "team-card--active" : ""}`}
        onMouseEnter={() => setActiveId(member.id)}
        onMouseLeave={() => setActiveId(null)}
      >
                <div className="team-image-wrap">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="team-image"
                  />

                  <div
                    className={`team-overlay ${
                      isActive ? "team-overlay--open" : ""
                    }`}
                  >
                    <div className="team-overlay-shape team-overlay-shape--top" />
                    <div className="team-overlay-shape team-overlay-shape--bottom" />
                    <p className="team-overlay-text">{member.description}</p>
                  </div>
                </div>

                <div className="team-content">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                </div>
              </article>
            );
          })}
        </div>
       </div>

    {/* 🌊 WAVE */}
    <div className="team-wave" />
  </section>
  );
}
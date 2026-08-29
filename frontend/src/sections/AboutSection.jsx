import React from "react";
import "./AboutSection.css";
import team from "../images/AU1.png";

const AboutSection = () => {
  return (
    <section
      className="about aproposNous"
      style={{
         backgroundImage: `url("/images/pattern-2.png")`,
    backgroundColor: "#f3f1ee",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="about-container">

        <div className="about-image">
          <img src={team} alt="Equipe Atlasia Kids" />
        </div>

        <div className="about-text">
        <h2 className="about-title">
            Une équipe soudée,<br/>
            Une mission partagée,<br/>
            Une revue joyeux
          </h2>

          <p className="about-paragraph">
            Chez Atlasia Kids, nous sommes une équipe passionnée de rédacteurs,
            d'auteurs, d'illustrateurs et d'éducateurs.
          </p>

          <p className="about-paragraph">
           Originaires des quatre coins du monde, nous nous réunissons avec un objectif commun : créer un espace où les enfants se sentent vus, valorisés et inspirés. Un espace où ils peuvent explorer leur foi avec joie, développer leur personnalité à travers les histoires et s'émerveiller du monde qui les entoure.
          </p>
<p className="about-paragraph">
           Depuis notre tout premier numéro en janvier 2026, chaque page d'Atlasia Kids a été conçue avec soin pour nourrir la foi, stimuler l'imagination et accompagner les familles dans l'éducation d'enfants confiants, bienveillants et spirituellement ancrés – le tout présenté avec une qualité d'illustration, de conception et de créativité irréprochable.
          </p>
          <p className="about-paragraph">
            Nous espérons qu'en ouvrant notre magazine, chaque enfant se sentira comme chez lui.
          </p>

          <button className="about-btn">
            Abonnez-vous maintenant
          </button>

        </div>

      </div>
       {/* 🌊 WAVE */}
  <div className="about-wave" />
    </section>
  );
};

export default AboutSection;

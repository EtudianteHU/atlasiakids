import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css"
const heroShapeUrl = "https://atlasiakids.com/wp-content/uploads/2024/08/hero-shape.png";
const heroBoyUrl = "https://atlasiakids.com/wp-content/uploads/2025/05/hero-boy-2.png";

export default function Hero() {
  return (
    <section className="hero">
     
  <div className="hero-navbar">
  </div>
      <div className="hero-container">
        <div className="hero-text">
         <h1 className="main-heading">
  La revue conçue pour les petits curieux,<span> adoptée par les familles</span>
</h1>
          <p className="desc">
          Pour les enfants de 6-11 ans,Atlasia Kids stimulent la creativité,évéillant la curiosité et permet acquerir les valeurs morales.
          </p>
          <Link to="/abonnement" className="hero-button">
            Rejoignez l'aventure dès aujourd'hui
          </Link>
        </div>

        <div className="hero-images">
          <img src={heroShapeUrl} alt="Forme décorative" className="hero-shape" />
          <img src={heroBoyUrl} alt="Garçon" className="hero-boy" />
        </div>
      </div>
<div className="hero-features">
  </div>
    </section>
  );
}

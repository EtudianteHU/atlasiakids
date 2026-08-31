import React from "react";
import "./HeroMagazine.css";
import coverLeftImg from "../images/page-de-garde-1.png";
import coverRightImg from "../images/page-de-garde-2.png";
export default function HeroMagazine({ onLeftClick, onRightClick, backgroundImage,className = ""
 }){
  return (
  <section className={`hero-magazine ${className}`}>
      <div className="hero-magazine-container">
        <div className="hero-magazine-text">
          <h1 className="hero-title">
            Abonnez-vous maintenant et recevez votre exemplaire de{" "}
            <span className="hero-highlight">Atlasia Kids !</span>
          </h1>

          <p className="hero-subtitle">
            Rejoignez une communauté grandissante de jeunes explorateurs !
            Chaque mois, Atlasia Kids propose des histoires, des activités et
            des aventures qui nourrissent la foi, éveillent la curiosité et
            inspirent un apprentissage joyeux, le tout conçu sur mesure pour les
            enfants de 6 à 11 ans.
          </p>
        </div>

        <div className="hero-cta-grid">
          <div className="hero-cta-item">
            <div
              className="hero-cta-cover"
              style={{ backgroundImage: `url(${coverLeftImg})` }}
            />

           <div
  className="hero-cta-card"
  style={{ backgroundImage: `url(${backgroundImage})` }}
>
                {/* 🔵 ICÔNE ICI */}
<div className="hero-icon hero-icon--orange">
  <i className="kg kg-educator"></i>
</div>
              <div className="hero-card-content">
                <h3 className="hero-cta-title">Le numéro de ce mois</h3>

                <p className="hero-cta-text">
                  Plonge dans nos nouvelles pages pensées pour inspirer les
                  jeunes esprits.
                </p>

                <button
                  className="hero-cta-btn hero-cta-btn--orange"
                  onClick={onLeftClick}
                >
                  →
                </button>
              </div>
            </div>
          </div>

          <div className="hero-cta-item">
            <div
              className="hero-cta-cover hero-cta-cover--right"
              style={{ backgroundImage: `url(${coverRightImg})` }}
            />

          <div
  className="hero-cta-card"
  style={{ backgroundImage: `url(${backgroundImage})` }}
>
                {/* 🔵 ICÔNE ICI */}
  <div className="hero-icon hero-icon--blue">
    <i className="kg kg-paint"></i>
  </div>

              <div className="hero-card-content">
                <h3 className="hero-cta-title">Restez informé</h3>

                <p className="hero-cta-text">
                  Abonnez-vous avant le 10 du mois pour recevoir le prochain
                  numéro !
                </p>

                <button
                  className="hero-cta-btn hero-cta-btn--blue"
                  onClick={onRightClick}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
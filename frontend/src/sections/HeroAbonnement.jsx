import React from "react";
import { useNavigate } from "react-router-dom";
import "./HeroAbonnement.css";
import Navbar from "../components/Navbar";

export default function HeroAbonnement({
  buttonText = "Abonnez-vous maintenant",
  title = "Abonnez-vous maintenant",
  description = "Recevez chaque mois une dose de joie, d'apprentissage et de divertissement inspirant directement chez vous.",
  buttonTo = "/",
}) {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    navigate(buttonTo);
  };

  return (
    <section className="heroSimple">
      <div className="heroSimple-shapes">
  <span className="shape circle s1"></span>
  <span className="shape circle s2"></span>
  <span className="shape circle s3"></span>

  <span className="shape square s4"></span>
  <span className="shape square s5"></span>
  <span className="shape circle s-left-circle"></span>


</div>
      <div className="heroSimpleOverlay" />

      <div className="heroSimpleInner">
        <button
          className="heroSimpleBtn"
          onClick={handleSubscribe}
          type="button"
        >
          {buttonText}
        </button>

        <h1 className="heroSimpleTitle">
          {title}
        </h1>

        <p className="heroSimpleText">
          {description}
        </p>
      </div>
    </section>
  );
}
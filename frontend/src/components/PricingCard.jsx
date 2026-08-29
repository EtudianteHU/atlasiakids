import React from "react";
import "./PricingCard.css";
import { useNavigate } from "react-router-dom";

export default function PricingCards({ SN1, SN2, onClick }) {
  const navigate = useNavigate();

  return (
    <section className="pricingPage">
      <div className="cardsRow">
        {/* ===== CARTE 1 ===== */}
        <article className="priceCard">
          <img src={SN1} alt="" className="cardMascotLeft" />

          <div className="topBar">
            <h3 className="topTitle">Abonnement annuel</h3>
            <span className="ribbonDiag">POPULAIRE</span>
          </div>

          <div className="cardBody">
            <div className="priceCenter">
              <span className="currencyTop">€</span>
              <span className="priceBig">84</span>
            </div>
            <div className="periodUnder">année</div>

           

            <button className="ctaBtn" onClick={() => onClick("annuel")}>
              Cliquez ici
            </button>
          </div>
        </article>

        {/* ===== CARTE 2 ===== */}
        <article className="priceCard">
          <img src={SN2} alt="" className="cardMascotRight" />

          <div className="topBar">
            <h3 className="topTitle">Acheter un numéro à l'unité</h3>
          </div>

          <div className="cardBody">
            <div className="priceCenter">
              <span className="currencyTop">€</span>
              <span className="priceBig">7,99</span>
            </div>
            <div className="periodUnder">mois</div>

            {/* ✅ Ici on navigue vers la page /acheter/numero */}
            <button
              className="ctaBtn"
              onClick={() => navigate("/acheter/numero")}
            >
            Cliquez ici
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
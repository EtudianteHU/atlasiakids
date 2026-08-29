import React from "react";
import "./Abonnement.css";
import HeroAbonnement from "../sections/HeroAbonnement";
import SN1 from "../images/SN1.png";
import SN2 from "../images/SN2.png";
import SN3 from "../images/SN3.png";

import PricingCards from "../components/PricingCard";
import NextIssueSection from "../sections/NextIssueSection";
import issues from "../data/numeroActuel.json";

import { useNavigate } from "react-router-dom";

export default function Abonnement() {
  const navigate = useNavigate();

  const handleCheckout = (type = "annuel") => {
    navigate("/checkout", { state: { abonnement: type } });
  };

  const imageMap = {
    SN1,
    SN2,
    SN3,
  };

  const promoIssue = issues.find((item) => item.id === "promo-prochain-numero");

  const defaultPromo = {
    title: "Ne Manquez Pas Le Prochain Numéro D'Atlasia Kids !",
    subtitle: "Abonnez-vous pour recevoir le prochain numéro",
    paragraphs: [
      "Abonnez-vous avant le 10 du mois pour recevoir le prochain numéro, rempli d'histoires, d'activités et de joie pour toute la famille.",
      "Assurez-vous d'être sur la liste de diffusion : chaque numéro est une nouvelle aventure !",
    ],
    imageKey: "SN3",
    buttonText: "Je m'abonne",
    bgClass: "issuePromo",
    reverse: false,
    plan: "annuel",
  };

  const promo = promoIssue || defaultPromo;

  return (
    <div className="abonnementPage">
   <HeroAbonnement
  buttonText="Abonnez-vous maintenant"
  title="Abonnez-vous maintenant"
  highlight="Maison des enfants Atlasia !"
  description="Recevez chaque mois une dose de joie, d’apprentissage et de divertissement inspirant, directement chez vous. Chaque numéro d’Atlasia Kids regorge d’histoires captivantes, de jeux, de bandes dessinées et bien plus encore pour les enfants curieux."
  buttonTo="/checkout"
/>

      <PricingCards SN1={SN1} SN2={SN2} onClick={handleCheckout} />

      <NextIssueSection
        title={promo.title}
        subtitle={promo.subtitle}
        paragraphs={promo.paragraphs}
        image={imageMap[promo.imageKey] || SN3}
        buttonText={promo.buttonText}
        onClick={() => handleCheckout(promo.plan || "annuel")}
        bgClass={promo.bgClass}
        reverse={promo.reverse}
        backgroundImage={promo.backgroundImage}
         backgroundColor={promo.backgroundColor}
      />
    </div>
  );
}
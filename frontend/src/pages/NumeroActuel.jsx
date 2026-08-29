import React from "react";
import HeroAbonnement from "../sections/HeroAbonnement";
import NextIssueSection from "../sections/NextIssueSection";
import HeroMagazine from "../components/HeroMagazine";
import "./NumeroActuel.css";
import issues from "../data/numeroActuel.json";

export default function NumeroActuel() {
  const handleAction = (id) => {
    console.log("action:", id);
  };

  return (
    <main className="numeroActuelPage">
      <HeroAbonnement
        title="Édition de ce mois-ci"
        text="Découvrez le numéro de ce mois-ci d'Atlasia Kids !"
        onSubscribe={() => handleAction("numero-actuel")}
          buttonTo = "/abonnement"
      />

   <HeroMagazine
  onLeftClick={() => handleAction("numero-actuel")}
  onRightClick={() => handleAction("abonnement")}
  backgroundImage="/images/background10.png" // 👈 ICI
   className="numero-actuel-hero" // 👈 AJOUT
/>

      {/* 5premières sections */}
      {issues.slice(0, 4).map((issue, index) => (
        <NextIssueSection
          key={issue.id}
          title={issue.title}
          subtitle={issue.subtitle}
          points={issue.points}
          image={issue.image}
              // 👇 image décorative ajoutée au 5e bloc
    decorImage={index === 4 ? "/images/turtle.png" : null}
          onClick={() => handleAction(issue.id)}
          reverse={index % 2 === 1}
          backgroundImage={issue.backgroundImage}
            backgroundColor={issue.backgroundColor}   // 👈 AJOUT ICI
          isFifth={index === 4} 
             // ⭐ AJOUT IMPORTANT SVG
    svgPattern={issue.svgPattern}
  className={
      issue.id === "numero-actuel"
        ? "numero-actuel-section"
        : ""
    }
        />
      ))}
    </main>
  );
}
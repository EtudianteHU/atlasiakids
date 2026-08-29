import React, { useState } from "react";
import HeroAbonnement from "../sections/HeroAbonnement";

const faqs = [
  {
    q: "C'est quoi Atlasia Kids ?",
    a: "Atlasia Kids est un magazine mensuel éducatif et divertissant, spécialement conçu pour les enfants de 6 à 11 ans."
  },
  {
    q: "Comment m'abonner ?",
    a: "Rendez-vous sur la page Abonnement, choisissez votre plan (mensuel ou annuel) et remplissez le formulaire de commande."
  },
  {
    q: "Quels sont les modes de paiement ?",
    a: "Nous acceptons le paiement par les cartes de crédit (Visa, Mastercard, etc.)."
  },
  {
    q: "La livraison est-elle gratuite ?",
    a: "Oui, la livraison est gratuite en France métropolitaine pour l'abonnement annuel."
  },
  {
    q: "Puis-je acheter un seul numéro ?",
    a: "Oui ! Rendez-vous sur la page 'Acheter Numéro Individuel' pour commander un numéro spécifique."
  },
  {
    q: "Comment contacter le service client ?",
    a: "Utilisez notre formulaire de contact ou envoyez un email à atlasiakidsfr"
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <>
      <HeroAbonnement
        buttonText="Aide Et FaQ"
        title="Questions"
        highlight="fréquentes"
        description="Retrouvez les réponses aux questions les plus courantes sur Atlasia Kids."
      />

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
        {faqs.map((faq, i) => (
          <div
            key={i}
            style={{
              borderBottom: "1px solid #eee",
              padding: "16px 0",
              cursor: "pointer",
            }}
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: 18, color: "#2a5da8" }}>{faq.q}</h3>
              <span style={{ fontSize: 24, color: "#f26f2d" }}>{openIdx === i ? "−" : "+"}</span>
            </div>
            {openIdx === i && (
              <p style={{ marginTop: 12, lineHeight: 1.7, color: "#555" }}>{faq.a}</p>
            )}
          </div>
        ))}
      </section>
    </>
  );
}
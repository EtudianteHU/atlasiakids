
import React from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import HeroMagazine from "../components/HeroMagazine";
import JoinAdventure from "../sections/JoinAdventure";
import { joinAdventureSections } from "../data/joinAdventureSections";
import CurrentIssue from "../sections/currentIssue";
import Testimonial from "../sections/Testimonial";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const handleLeftClick = () => {
    navigate("/current-issue");
  };

  const handleRightClick = () => {
    navigate("/abonnement");
  };

  return (
    <main className="homePage">
      <Hero />

      <HeroMagazine
        topText="Foi, Divertissement et Découverte — Livrés tous les mois !"
        title={
          <>
            Abonnez-vous dès maintenant et recevez votre exemplaire d’
            <span className="hero-title-highlight">Atlasia Kids</span> !
          </>
        }
        subtitle="Rejoignez une communauté grandissante de jeunes explorateurs ! Chaque mois, Atlasia Kids propose des histoires, des activités et des aventures qui nourrissent la foi, éveillent la curiosité et inspirent un apprentissage joyeux — spécialement conçus pour les enfants de 6 à 11 ans."
        onLeftClick={handleLeftClick}
        onRightClick={handleRightClick}
        backgroundImage="/images/background9.png"
      />

      <JoinAdventure
        showCoversFirst={false}
        kicker=""
        title=""
        underline=""
        desc=""
        buttonText=""
        sections={joinAdventureSections}
      />

      <CurrentIssue />
      <Testimonial />
    </main>
  );
}


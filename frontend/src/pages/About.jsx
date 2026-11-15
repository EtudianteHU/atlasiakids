import React from "react";
import HeroAbonnement from "../sections/HeroAbonnement";
import HeroMagazine from "../components/HeroMagazine";
import NextIssueSection from "../sections/NextIssueSection";
import TeamSection from "../components/TeamSection.jsx";
import issues from "../data/numeroActuel.json";
import AboutSection from "../data/aboutSections.json";
export default function About() {
  const handleAction = (id) => {
    console.log("action:", id);
  };

  const issue = issues?.[4];

 const about3 = AboutSection.find(
  (section) => section.id === "about-3"
);
 const about2 = AboutSection.find(
  (section) => section.id === "about-2"
);

  const about1 = AboutSection.find(
    (section) => section.id === "about-1"
  );
  return (
    <>
      <HeroAbonnement
        variant="A propos de nous"
        buttonText="A propos de nous"
        title="Conçu pour les petits curieux"
        highlight="adoré par les familles"
        description="Chaque numéro d'Atlasia Kids est réalisé avec soin pour refléter les valeurs morales, stimuler la créativité et célébrer l'enfance avec excellence et cœur."
        buttonTo="/about"
      />
          {/* ABOUT-3 juste après HeroAbonnement */}
    {about3 && (
  <NextIssueSection
    key={about3.id}
    title={about3.title}
    paragraphs={about3.paragraphs}
    image={about3.image}
    buttonText={about3.buttonText}
    buttonLink={about3.buttonLink}
    backgroundImage={about3.backgroundImage}
    backgroundColor={about3.backgroundColor}
    reverse={about3.reverse}
     className="about-3-section"
  />
)}
      <HeroMagazine
        backgroundImage="/images/background9.png"
      />
      {/* ABOUT-1 */}
      {about1 && (
        <NextIssueSection
          key={about1.id}
          title={about1.title}
          points={about1.points}
          video={about1.video}
           image={about1.image}
          decorImage={about1.decorImage}
          backgroundImage={about1.backgroundImage}
          backgroundColor={about1.backgroundColor}
          reverse={about1.reverse}
        />
      )}
      <TeamSection />

    {about2 && (
  <NextIssueSection
    key={about2.id}
    title={about2.title}
    paragraphs={about2.paragraphs}
    image={about2.image}
     video={about2.video}
    buttonText={about2.buttonText}
    buttonLink={about2.buttonLink}
    backgroundImage={about2.backgroundImage}
    backgroundColor={about2.backgroundColor}
    reverse={about2.reverse}
     className="about-2-section"
  />
)}
    </>
  );
}
import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111]">
      <main className="flex-grow max-w-4xl mx-auto px-6 py-12">

        {/* TITRE */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#101a8b] mb-10 text-center">
          🍪 Politique de confidentialité – Atlasia Kids
        </h1>

        <div className="space-y-10 text-lg leading-relaxed">

          {/* INTRO */}
          <section>
            <p>
              Bienvenue sur <strong>Atlasia Kids</strong> 🌈  
              Nous sommes un site de magazine pour enfants et familles.
              Nous respectons votre vie privée et la protection des données
              personnelles conformément au RGPD (France / Europe).
            </p>
          </section>

          {/* DONNEES */}
          <section>
            <h2 className="text-2xl font-bold mb-4">📌 Données collectées</h2>

            <p>
              Nous collectons uniquement les données nécessaires au fonctionnement du site :
            </p>

            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Cookies techniques indispensables au site</li>
              <li>Statistiques anonymes (uniquement si vous acceptez)</li>
              <li>Aucune donnée sensible n’est collectée</li>
            </ul>
          </section>

          {/* COOKIES */}
          <section>
            <h2 className="text-2xl font-bold mb-4">🍪 Cookies</h2>

            <p>
              Les cookies servent uniquement à :
            </p>

            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Faire fonctionner correctement le site</li>
              <li>Mesurer le trafic de manière anonyme (si accepté)</li>
            </ul>

            <p className="mt-3">
              Vous pouvez accepter, refuser ou personnaliser les cookies à tout moment.
            </p>
          </section>

          {/* UTILISATION */}
          <section>
            <h2 className="text-2xl font-bold mb-4">🔍 Utilisation des données</h2>

            <p>
              Les données sont utilisées uniquement pour :
            </p>

            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Améliorer le site</li>
              <li>Comprendre l’utilisation globale (anonyme)</li>
            </ul>

            <p className="mt-3">
              Nous ne vendons jamais vos données.
            </p>
          </section>

          {/* ENFANTS */}
          <section>
            <h2 className="text-2xl font-bold mb-4">🧸 Protection des enfants</h2>

            <p>
              Atlasia Kids est un site destiné aux enfants et aux familles.
              Nous faisons tout pour garantir un environnement sûr, sans publicité intrusive
              ni collecte excessive de données.
            </p>
          </section>

          {/* DROITS */}
          <section>
            <h2 className="text-2xl font-bold mb-4">⚖️ Vos droits (RGPD)</h2>

            <p>
              Vous avez le droit de :
            </p>

            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Accéder à vos données</li>
              <li>Les modifier</li>
              <li>Les supprimer</li>
            </ul>
          </section>

          {/* CONTACT */}
          <section>
            <h2 className="text-2xl font-bold mb-4">📩 Contact</h2>

            <p>
              Pour toute question : <br />
              📧atlasiakidsfr@gmail.com
            </p>
          </section>

          {/* CONSENTEMENT */}
          <section>
            <h2 className="text-2xl font-bold mb-4">✔ Consentement</h2>

            <p>
              En utilisant ce site, vous acceptez cette politique de confidentialité.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
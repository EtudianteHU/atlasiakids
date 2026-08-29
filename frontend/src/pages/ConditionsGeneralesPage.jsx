import React from "react";

export default function ConditionsGeneralesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111]">
      <main className="flex-grow max-w-4xl mx-auto px-6 py-12">

        {/* TITRE */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#101a8b] mb-10 text-center">
          ⚖️ Conditions générales – Atlasia Kids
        </h1>

        <div className="space-y-10 text-lg leading-relaxed">

          {/* INTRO */}
          <section>
            <p className="font-semibold uppercase">
              VEUILLEZ LIRE ATTENTIVEMENT CES CONDITIONS AVANT D’UTILISER LE SITE.
            </p>

            <p>
              Bienvenue sur <strong>Atlasia Kids</strong> 🌈  
              Ce site est un magazine en ligne destiné aux enfants et aux familles.
              L’utilisation du site implique l’acceptation des présentes conditions.
            </p>
          </section>

          {/* DROITS */}
          <section>
            <h2 className="text-2xl font-bold mb-4">📌 Propriété intellectuelle</h2>

            <p>
              L’ensemble du contenu du site (textes, images, vidéos, graphismes)
              est protégé par le droit d’auteur et appartient à Atlasia Kids ou à ses partenaires.
            </p>

            <p>
              Toute reproduction, modification ou diffusion sans autorisation est interdite,
              sauf usage personnel et non commercial.
            </p>
          </section>

          {/* UTILISATION */}
          <section>
            <h2 className="text-2xl font-bold mb-4">🧸 Utilisation du site</h2>

            <p>
              Le site est destiné à un usage éducatif et ludique pour les enfants.
              Il est interdit d’utiliser le site pour :
            </p>

            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>nuire au bon fonctionnement du site</li>
              <li>publier des contenus inappropriés</li>
              <li>tenter d’accéder à des données non autorisées</li>
            </ul>
          </section>

          {/* RESPONSABILITE */}
          <section>
            <h2 className="text-2xl font-bold mb-4">⚠️ Responsabilité</h2>

            <p>
              Atlasia Kids s’efforce de fournir un site fiable et sécurisé.
              Cependant, nous ne pouvons garantir une absence totale d’erreurs ou d’interruptions.
            </p>
          </section>

          {/* DONNEES */}
          <section>
            <h2 className="text-2xl font-bold mb-4">🔒 Données personnelles</h2>

            <p>
              L’utilisation du site respecte le Règlement Général sur la Protection des Données (RGPD).
              Aucune donnée personnelle n’est vendue.
            </p>
          </section>

          {/* COOKIES */}
          <section>
            <h2 className="text-2xl font-bold mb-4">🍪 Cookies</h2>

            <p>
              Le site utilise uniquement :
            </p>

            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>des cookies techniques nécessaires</li>
              <li>des cookies statistiques uniquement avec consentement</li>
            </ul>

            <p className="mt-3">
              Vous pouvez accepter ou refuser les cookies à tout moment.
            </p>
          </section>

          {/* MINEURS */}
          <section>
            <h2 className="text-2xl font-bold mb-4">🧸 Protection des enfants</h2>

            <p>
              Atlasia Kids est conçu pour un public jeune.
              Nous veillons à proposer un contenu sécurisé, sans publicité intrusive
              ni collecte excessive de données.
            </p>
          </section>

          {/* DROITS */}
          <section>
            <h2 className="text-2xl font-bold mb-4">⚖️ Droits des utilisateurs (RGPD)</h2>

            <p>
              Conformément au RGPD, vous disposez des droits suivants :
            </p>

            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Droit d’accès</li>
              <li>Droit de rectification</li>
              <li>Droit de suppression</li>
              <li>Droit d’opposition</li>
            </ul>
          </section>

          {/* CONTACT */}
          <section>
            <h2 className="text-2xl font-bold mb-4">📩 Contact</h2>

            <p>
              Pour toute question :  
              <br />
            📧 atlasiakidsfr@gmail.com
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
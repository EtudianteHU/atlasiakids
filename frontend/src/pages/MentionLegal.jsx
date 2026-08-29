import React from "react";

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111]">
      <main className="flex-grow max-w-4xl mx-auto px-6 py-12">

        {/* TITRE */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#101a8b] mb-10 text-center">
          ⚖️ Mentions légales – Atlasia Kids
        </h1>

        <div className="space-y-10 text-lg leading-relaxed">

          {/* EDITEUR */}
          <section>
            <h2 className="text-2xl font-bold mb-4">📌 Éditeur du site</h2>

            <p>
              Le site <strong>Atlasia Kids</strong> est édité par :
            </p>

            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Nom du site :atlasiakids.fr</li>
              <li>Responsable :Chloé GOKKUS</li>
              <li>Email :atlasiakidsfr@gmail.com</li>
              <li>Adresse :7 Rue Pasteur ,
              91260 Juvisy-sur-Orge</li>
            </ul>
          </section>

          {/* HEBERGEUR */}
          <section>
            <h2 className="text-2xl font-bold mb-4">🌐 Hébergement</h2>

            <p>
              Le site est hébergé par :
            </p>

          <ul className="list-disc pl-6 space-y-2 mt-2">
  <li>Nom de l’hébergeur : Vercel Inc.</li>
  <li>Adresse : 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis</li>
  <li>Site web : https://vercel.com</li>
</ul>
          </section>

          {/* ACTIVITE */}
          <section>
            <h2 className="text-2xl font-bold mb-4">🧸 Activité du site</h2>

            <p>
              Atlasia Kids est un site de magazine en ligne destiné aux enfants et aux familles.
              Le contenu est éducatif et ludique.
            </p>
          </section>

          {/* PROPRIETE */}
          <section>
            <h2 className="text-2xl font-bold mb-4">📚 Propriété intellectuelle</h2>

            <p>
              Tous les contenus présents sur le site (textes, images, vidéos, design)
              sont protégés par le droit d’auteur.
            </p>

            <p>
              Toute reproduction ou utilisation sans autorisation est interdite.
            </p>
          </section>

          {/* DONNEES */}
          <section>
            <h2 className="text-2xl font-bold mb-4">🔒 Données personnelles</h2>

            <p>
              Les données collectées sur ce site sont traitées conformément au RGPD (France / Europe).
              Elles ne sont jamais vendues à des tiers.
            </p>
          </section>

          {/* CONTACT */}
          <section>
            <h2 className="text-2xl font-bold mb-4">📩 Contact</h2>

            <p>
              Pour toute question :<br />
              📧atlasiakidsfr@gmail.com
            </p>
          </section>

          {/* MINEURS */}
          <section>
            <h2 className="text-2xl font-bold mb-4">🧸 Protection des mineurs</h2>

            <p>
              Atlasia Kids est un site destiné aux enfants et aux familles.
              Nous veillons à proposer un contenu sécurisé et adapté à un jeune public.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
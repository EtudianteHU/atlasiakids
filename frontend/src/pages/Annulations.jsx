import React from "react";

export default function AnnulationsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111]">
      <main className="flex-grow max-w-4xl mx-auto px-6 py-12">

        {/* TITRE */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#101a8b] mb-10 text-center">
          🔄 Annulations & remboursements – Atlasia Kids
        </h1>

        <div className="space-y-10 text-lg leading-relaxed">

          {/* INTRO */}
          <section>
            <p>
              Cette page explique les conditions d’annulation et de remboursement
              pour les abonnements et éventuelles précommandes sur Atlasia Kids 🌈
            </p>
          </section>

          {/* ABONNEMENTS */}
          <section>
            <h2 className="text-2xl font-bold mb-4">📦 Abonnements</h2>

            <p>
              Certains services peuvent fonctionner sous forme d’abonnement avec des
              renouvellements périodiques.
            </p>

            <p>
              Vous pouvez annuler votre abonnement à tout moment depuis votre espace
              utilisateur ou via le lien présent dans vos e-mails de confirmation.
            </p>

            <p>
              L’annulation prend effet à la fin de la période déjà payée, sauf mention contraire.
            </p>
          </section>

          {/* PAIEMENT */}
          <section>
            <h2 className="text-2xl font-bold mb-4">💳 Paiement</h2>

            <p>
              Les paiements sont sécurisés et traités via des prestataires conformes aux normes européennes.
              Aucun paiement n’est conservé sans sécurité renforcée.
            </p>
          </section>

          {/* PRECOMMANDES */}
          <section>
            <h2 className="text-2xl font-bold mb-4">📦 Précommandes</h2>

            <p>
              Une précommande concerne un produit ou contenu disponible prochainement.
            </p>

            <p>
              Vous pouvez annuler une précommande tant que celle-ci n’a pas été traitée ou expédiée.
              Une fois la commande en cours de traitement, l’annulation peut ne plus être possible.
            </p>
          </section>

          {/* ESSAI */}
          <section>
            <h2 className="text-2xl font-bold mb-4">🧪 Essai avant achat</h2>

            <p>
              Si une offre d’essai est proposée, vous disposez d’un délai pour décider
              si vous souhaitez conserver le service ou le produit.
            </p>

            <p>
              Sans action de votre part à la fin de la période d’essai, la facturation peut être effectuée
              conformément aux conditions de l’offre.
            </p>
          </section>

          {/* REMBOURSEMENT */}
          <section>
            <h2 className="text-2xl font-bold mb-4">💰 Remboursements</h2>

            <p>
              Les demandes de remboursement sont traitées conformément à la législation française
              et aux conditions de vente applicables.
            </p>

            <p>
              En cas de problème, vous pouvez nous contacter afin d’étudier votre demande.
            </p>
          </section>

          {/* CONTACT */}
          <section>
            <h2 className="text-2xl font-bold mb-4">📩 Contact</h2>

            <p>
              Pour toute question concernant une annulation ou un remboursement :<br />
             📧 atlasiakidsfr@gmail.com
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
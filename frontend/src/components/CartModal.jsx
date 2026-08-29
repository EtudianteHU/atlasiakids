import React from "react";
import "./CartModal.css";

export default function CartModal({
  open,
  data,
  onClose,
  onContinue,
  onViewCart
}) {

  // 👉 si la modale n'est pas ouverte on affiche rien
  if (!open) return null;

  return (
    <div className="cm-backdrop" onClick={onClose}>

      <div className="cm-modal" onClick={(e) => e.stopPropagation()}>

        <button className="cm-close" onClick={onClose}>
          ×
        </button>

        <div className="cm-grid">

          {/* LEFT */}
          <div className="cm-left">

            <h3 className="cm-success">
              Produit ajouté avec succès à votre panier
            </h3>

            <div className="cm-item">

              <div className="cm-thumb">
                <img
                  src={data?.addedItem?.coverUrl}
                  alt=""
                />
              </div>

              <div>
                <div className="cm-title">
                  {data?.addedItem?.title}
                </div>

                <div className="cm-qty">
                  Quantité : {data?.qtyAdded}
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT */}
          <div className="cm-right">

            <div className="cm-count">
              Il y a {data?.summary?.count || 0} article(s)
              dans votre panier
            </div>

            <div className="cm-total">
              {(data?.summary?.total || 0)
                .toFixed(2)
                .replace(".", ",")} € EUR
            </div>

            <div className="cm-actions">

              <button
                className="cm-btn cm-primary"
                onClick={onContinue}
              >
                CONTINUEZ VOS ACHATS
              </button>

              <button
                className="cm-btn cm-secondary"
                onClick={onViewCart}
              >
                🛒 VOIR LE PANIER
              </button>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
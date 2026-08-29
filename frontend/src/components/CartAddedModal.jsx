import React from "react";
import { useNavigate } from "react-router-dom";
import "./CartAddedModal.css";

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
};

const getCartCount = (cart) =>
  cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

const getCartTotal = (cart) =>
  cart.reduce((sum, item) => sum + Number(item.price || 0) * (item.quantity || 1), 0);

export default function CartAddedModal({ open, onClose, addedItem }) {
  const navigate = useNavigate();

  if (!open || !addedItem) return null;

  const cart = readCart();
  const count = getCartCount(cart);
  const total = getCartTotal(cart);

  const goPanier = () => {
    onClose?.();
    navigate("/panier");
  };

 const continueShop = () => {
  onClose?.();
  navigate("/acheter/numero");
};
  return (
    <div className="camOverlay" onMouseDown={onClose}>
      <div className="camModal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="camClose" onClick={onClose} aria-label="Fermer">
          ✕
        </button>

        <div className="camContent">
          {/* LEFT */}
          <div className="camLeft">
            <div className="camMsg">Produit ajouté avec succès à votre panier</div>

            <div className="camItemRow">
              <img className="camThumb" src={addedItem.image} alt="" />
              <div className="camItemText">
                <div className="camItemTitle">{addedItem.title}</div>
                <div className="camItemQty">Quantité : {addedItem.quantity || 1}</div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="camRight">
            <div className="camCount">Il y a {count} article(s) dans votre panier</div>
            <div className="camTotal">{total.toFixed(2).replace(".", ",")} € EUR</div>

            <div className="camBtns">
              <button className="camBtn camBtnGhost" onClick={continueShop}>
                CONTINUEZ VOS ACHATS
              </button>

              <button className="camBtn camBtnSolid" onClick={goPanier}>
                🛒 VOIR LE PANIER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
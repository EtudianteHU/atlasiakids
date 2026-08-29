import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MiniCart.css";

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
};

const writeCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));
const getId = (item) => item?.id || item?._id || item?.number || item?.productId;
const formatEUR = (n) => Number(n || 0).toFixed(2).replace(".", ",") + " €";

export default function MiniCart() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState(readCart());
  const wrapRef = useRef(null);

  // refresh when localStorage changes
useEffect(() => {
  const syncCart = () => {
    setCart(readCart());
  };

  window.addEventListener("cartUpdated", syncCart);

  return () => {
    window.removeEventListener("cartUpdated", syncCart);
  };
}, []);

  // close on outside click
  useEffect(() => {
    const onDown = (e) => {
      if (!open) return;
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  const count = useMemo(
    () => cart.reduce((sum, it) => sum + (it.quantity || 1), 0),
    [cart]
  );

  const total = useMemo(
    () => cart.reduce((sum, it) => sum + Number(it.price || 0) * (it.quantity || 1), 0),
    [cart]
  );

const removeItem = (id) => {
  const next = cart.filter((it) => getId(it) !== id);
  setCart(next);
  writeCart(next);
    window.dispatchEvent(new Event("cartUpdated"));
};

  return (
    <div className="mcWrap" ref={wrapRef}>
      <button className="mcIconBtn" onClick={() => {
  setCart(readCart());
  setOpen((v) => !v);
}}>
        <span className="mcIcon">🛒</span>
        {count > 0 && <span className="mcBadge">{count}</span>}
      </button>

      {open && (
        <div className="mcPop">
          <div className="mcItems">
            {cart.length === 0 ? (
              <div className="mcEmpty">Votre panier est vide.</div>
            ) : (
              cart.map((it) => (
                <div className="mcRow" key={getId(it)}>
                  <img className="mcThumb" src={it.image} alt="" />
                  <div className="mcText">
                    <div className="mcTitle">{it.title}</div>
                    <div className="mcLine">
                      {formatEUR(it.price)} x {it.quantity || 1}
                    </div>
                  </div>
                  <button className="mcRemove" onClick={() => removeItem(getId(it))}aria-label="Retirer">
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="mcTotalRow">
            <span className="mcTotalLabel">TOTAL DU PANIER :</span>
            <span className="mcTotalValue">{formatEUR(total)}</span>
          </div>

          <div className="mcBtns">
            <button
              className="mcBtn"
              onClick={() => { setOpen(false); navigate("/checkout"); }}
              disabled={cart.length === 0}
            >
              ✓ Vérifier
            </button>

            <button
              className="mcBtn"
              onClick={() => { setOpen(false); navigate("/panier"); }}
              disabled={cart.length === 0}
            >
              🧺 Voir le Panier
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
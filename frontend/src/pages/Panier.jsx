import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Panier.css";

// ---------------- STORAGE ----------------
const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
};

const writeCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// ---------------- FORMAT ----------------
const formatEUR = (n) =>
  Number(n || 0).toFixed(2).replace(".", ",") + " €";
const parsePrice = (price) => {
  if (!price) return 0;
  return Number(String(price).replace(",", "."));
};
// ---------------- SAFE ID ----------------
const getId = (item) => item?.productId || item?._id || item?.number;

// ---------------- COMPONENT ----------------
export default function Panier() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");

  // Load cart
 useEffect(() => {
  const data = readCart();

  setCart(data);

  console.log("CART RAW:", data);
  console.log("CART LENGTH:", data.length);

  const savedNote = localStorage.getItem("cart_note");
  if (savedNote) {
    setNote(savedNote);
    setShowNote(true);
  }
}, []);
  // Save note
  useEffect(() => {
    localStorage.setItem("cart_note", note);
  }, [note]);

  // ---------------- SUBTOTAL ----------------
  const subtotal = useMemo(() => {
    return cart.reduce((sum, it) => {
    return sum + parsePrice(it.price) * Number(it.quantity || 1);
    }, 0);
  }, [cart]);

  // ---------------- UPDATE QTY ----------------
  const updateQty = (productId, delta) => {
    setCart((prev) => {
      const next = prev.map((it) => {
        if (getId(it) !== productId) return it;

        const q = Math.max(1, Number(it.quantity || 1) + delta);

        return { ...it, quantity: q };
      });

      writeCart(next);
       window.dispatchEvent(new Event("cartUpdated"));
      return next;
    });
  };

  // ---------------- REMOVE ----------------
  const removeItem = (productId) => {
    setCart((prev) => {
      const next = prev.filter((it) => getId(it) !== productId);

      writeCart(next);
      window.dispatchEvent(new Event("cartUpdated"));
      return next;
    });
  };

  // ---------------- CLEAR ----------------
  const clearCart = () => {
    writeCart([]);
      window.dispatchEvent(new Event("cartUpdated"));
    localStorage.removeItem("cart_note");
    setCart([]);
    setNote("");
    setShowNote(false);
  };

  // ---------------- REFRESH ----------------
  const refreshCart = () => {
    setCart(readCart());
  };

  // ---------------- UI ----------------
  return (
    <div className="panierPage">
      <div className="panierWrap">

        {/* TABLE */}
        <div className="panierTable">
          <div className="panierHead">
            <div>Produit</div>
            <div>Prix</div>
            <div>Quantité</div>
            <div>Total</div>
            <div>Retirer</div>
          </div>

          {cart.length === 0 ? (
            <div className="panierEmpty">
              <p>Votre panier est vide.</p>
              <button
                className="panierBtn panierBtnPrimary"
                onClick={() => navigate("/acheter/numero")}
              >
                Continuer vos achats
              </button>
            </div>
          ) : (
            cart.map((it) => {
              const id = getId(it);
              const quantity = Number(it.quantity || 1);
            const lineTotal = parsePrice(it.price) * quantity;

              return (
                <div className="panierRow" key={id}>

                  {/* PRODUIT */}
                  <div className="produitCell">
                    <img className="prodImg" src={it.image} alt={it.title} />
                    <h3 className="prodTitle">{it.title}</h3>
                  </div>

                  {/* PRIX */}
                 <div>{formatEUR(parsePrice(it.price))}</div>

                  {/* QUANTITÉ */}
               <div className="qtyWrapper">
  <button
    className="qtyBtn"
    onClick={() => updateQty(id, -1)}
  >
    -
  </button>

  <div className="qtyBox">{quantity}</div>

  <button
    className="qtyBtn"
    onClick={() => updateQty(id, 1)}
  >
    +
  </button>
</div>

                  {/* TOTAL */}
                  <div>{formatEUR(lineTotal)}</div>

                  {/* REMOVE */}
                <button className="removeBtn" onClick={() => removeItem(id)}>
  ×
</button>
                </div>
              );
            })
          )}
        </div>

           {/* BOTTOM */}
        {cart.length > 0 && (
          <div className="panierBottom">

            {/* DROITE */}
            <div className="bottomRight">

              <div className="subtotalRow">
                <span className="subtotalLabel">Sous-total :</span>
                <span className="subtotalValue">
                  {formatEUR(subtotal)}
                </span>
              </div>

              <p className="smallText">
                Les frais de livraison, les taxes et les réductions seront calculés lors du paiement.
              </p>

              <div className="btnRow">
                <button
                  className="panierBtn"
                  onClick={() => navigate("/acheter/numero")}
                >
                  Continuez vos achats
                </button>

                <button
                  className="panierBtn"
                  onClick={refreshCart}
                >
                  Mettre à jour le panier
                </button>

                <button
                  className="panierBtn"
                  onClick={() => navigate("/checkout")}
                >
                  Passer au paiement
                </button>
              </div>

              <button
                className="clearBtn"
                onClick={clearCart}
              >
                Vider le panier
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
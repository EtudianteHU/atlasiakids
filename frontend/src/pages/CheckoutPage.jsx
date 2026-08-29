import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./CheckoutPage.css";


const API_URL = "http://localhost:5000";

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
};

const formatEUR = (n) => Number(n || 0).toFixed(2).replace(".", ",") + " €";
// 👉 AJOUTE ICI
const parsePrice = (price) => {
  if (!price) return 0;
  return Number(String(price).replace(",", "."));
};
const PLAN_PRICES = {
  annuel: 84,
};

export default function CheckoutPage() {
  const location = useLocation();
  const abonnement = location.state?.abonnement; // "mensuel" | "annuel" | undefined

  const [cart, setCart] = useState([]);
const safeCart = useMemo(() => {
    if (!Array.isArray(cart)) return [];
  return cart.filter((item) => {
    return (
      item &&
      typeof item._id === "string" &&
      item.title &&
      item.price != null
    );
  });
}, [cart]);
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("France");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (!abonnement) {
    const load = () => setCart(readCart());

    load();

    window.addEventListener("cartUpdated", load);

    return () => window.removeEventListener("cartUpdated", load);
  }
}, [abonnement]);

  const isSubscription = Boolean(abonnement);
  const planPrice = PLAN_PRICES[abonnement] || 0;

  useEffect(() => {
    console.log("cart:", cart);
  console.log("safeCart:", safeCart);
    if (isSubscription) {
      setPaymentMethod("card");
    }
  }, [isSubscription]);
    // ✅ SAFE CART (UNE SEULE FOIS)

console.log("SAFE CART FINAL:", safeCart);
  const subtotal = useMemo(() => {
    if (isSubscription) return planPrice;

    return safeCart.reduce((sum, it) => {
      return sum + parsePrice(it.price || 0) * Number(it.quantity || 1);
    }, 0);
  }, [safeCart, isSubscription, planPrice]);

  const cartCount = useMemo(() => {
    if (isSubscription) return 1;

    return safeCart.reduce((sum, it) => {
      return sum + Number(it.quantity || 1);
    }, 0);
  }, [ safeCart, isSubscription]);
  console.log("FIRST ITEM:", cart[0]);
console.log("cart:", cart);
console.log("safeCart:", safeCart);

  const validateForm = () => {
    if (!email || !firstName || !lastName || !address || !postalCode || !city) {
      alert("Merci de remplir tous les champs obligatoires.");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Merci de saisir une adresse e-mail valide.");
      return false;
    }

    if (!isSubscription && safeCart.length === 0) {
      alert("Votre panier est vide.");
      return false;
    }

    return true;
  };

  const handlePay = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      // --- ABONNEMENT => Stripe obligatoire
      if (isSubscription) {
       const subscriptionItemId = "abonnement_annuel";

        const res = await fetch(`${API_URL}/api/checkout/create-session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            abonnement,
            customer: {
              firstName,
              lastName,
              company,
              address,
              postalCode,
              city,
              country,
            },
 items: [
  {
    productId: subscriptionItemId,
    type: "subscription",
    quantity: 1,
  },
],

          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Erreur lors de la création de la session Stripe");
        }

        if (!data.url) {
          throw new Error("Lien Stripe introuvable");
        }

        window.location.href = data.url;
        return;
      }

      // --- PRODUITS : paiement par carte => Stripe Checkout
      if (paymentMethod === "card") {
        const res = await fetch(`${API_URL}/api/checkout/create-session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            abonnement,
            customer: {
              firstName,
              lastName,
              company,
              address,
              postalCode,
              city,
              country,
            },
items: safeCart.map((item) => ({
   productId: item._id || item.productId,
  quantity: Number(item.quantity || 1),
}))
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Erreur lors de la création du paiement Stripe");
        }

        if (!data.url) {
          throw new Error("Lien Stripe introuvable");
        }

        window.location.href = data.url;
        return;
      }

      // --- PRODUITS : paiement à la caisse
      const orderData = {
        customer: {
          email,
          firstName,
          lastName,
          company,
          address,
          postalCode,
          city,
          country,
        },
items: safeCart.map((item) => {
 console.log("ITEM:", item);
  console.log("ID envoyé:", item.productId || item._id);

  return {
 productId: item._id ,
    title: item.title,
   price: parsePrice(item.price),
    quantity: Number(item.quantity || 1),
    image: item.image || "",
  };
}),  subtotal,
        total: subtotal,
        paymentMethod,
      };
      console.log("ITEMS SENT:", safeCart);
console.log("ITEMS SENT TO BACKEND:", safeCart.map(item => ({
 productId: item._id,
  quantity: item.quantity
})));
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

const data = await res.json();

console.log("STRIPE RESPONSE:", data); // 👈 ICI

if (!res.ok) {
  throw new Error(data.message || "Erreur Stripe");
}

if (!data.url) {
  throw new Error("URL Stripe manquante");
}
console.log("Réponse Stripe :", data);
console.log("URL Stripe :", data.url);
window.location.href = data.url;
      localStorage.removeItem("cart");
      setCart([]);

      alert("Commande envoyée avec succès ✅");
    
    } catch (err) {
      alert(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ckPage">
      <div className="ckShell">
        <div className="ckLeft">
          <form className="ckForm" onSubmit={handlePay}>
            <div className="ckSection">
              <div className="ckSectionTop">
                <h2 className="ckH2">Contact</h2>
                <a
                  className="ckLink"
                  href="/login"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/login";
                  }}
                >
                  Se connecter
                </a>
              </div>

              <label className="ckLabel">E-mail</label>
              <input
                className="ckInput"
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className="ckCheckbox">
                <input type="checkbox" defaultChecked />
                <span>Envoyez-moi un e-mail avec les actualités et les offres</span>
              </label>
            </div>

            <div className="ckSection">
              <h2 className="ckH2">{isSubscription ? "Facturation" : "Livraison"}</h2>

              <label className="ckLabel">Pays/Région</label>
              <select
                className="ckInput"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option>France</option>
                <option>Belgique</option>
                <option>Maroc</option>
                <option>Canada</option>
              </select>

              <div className="ckGrid2">
                <div>
                  <label className="ckLabel">Prénom</label>
                  <input
                    className="ckInput"
                    placeholder="Prénom"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="ckLabel">Nom de famille</label>
                  <input
                    className="ckInput"
                    placeholder="Nom de famille"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <label className="ckLabel">Société (facultatif)</label>
              <input
                className="ckInput"
                placeholder="Société (facultatif)"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />

              <label className="ckLabel">Adresse</label>
              <input
                className="ckInput"
                placeholder="Adresse"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <div className="ckGrid2">
                <div>
                  <label className="ckLabel">Code postal</label>
                  <input
                    className="ckInput"
                    placeholder="Code postal"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>

                <div>
                  <label className="ckLabel">Ville</label>
                  <input
                    className="ckInput"
                    placeholder="Ville"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="ckSection">
              <h2 className="ckH2">Paiement</h2>
              <div className="ckSmall">
                Toutes les transactions sont sécurisées et cryptées.
              </div>

              <div className="ckPayBox">
                <div className="ckPayTop">
                  <label className="ckRadio">
                    <input
                      type="radio"
                      name="pay"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                    />
                    <span>Carte de crédit</span>
                  </label>      
                </div>

                {paymentMethod === "card" && (
                  <>
                    <div className="ckSmall" style={{ marginTop: "12px" }}>
                      Après validation, vous serez redirigé vers Stripe pour payer
                      en toute sécurité.
                    </div>

                    <label className="ckCheckbox">
                      <input type="checkbox" defaultChecked />
                      <span>
                        Utilisez l'adresse renseignée comme adresse de facturation.
                      </span>
                    </label>
                  </>
                )}

                {!isSubscription && paymentMethod === "cash_on_delivery" && (
                  <div className="ckSmall">
                   Le paiement sera effectué lors de la confirmation de la commande.
                  </div>
                )}
              </div>
            </div>

            <button className="ckPayBtn" type="submit" disabled={loading}>
              {loading
                ? "Envoi..."
                : isSubscription
                ? "Continuer vers le paiement"
                : "Valider la commande"}
            </button>

            <div className="ckFooterLinks">
              <Link to="/privacy-policy">Politique de confidentialité</Link>
              <Link to="/conditions">Conditions générales</Link>
              <Link to="/annulations">Annulations</Link>
               <Link to="/mentionLegal">Mentions légales</Link>
            </div>
          </form>
        </div>

        <aside className="ckRight">
          <div className="ckSummary">
            {isSubscription ? (
              <div className="ckItem">
                <div className="ckThumbWrap">
                  <div className="ckQtyBubble">1</div>
                </div>
                <div className="ckItemTitle">
               Abonnement Atlasia Kids (Annuel)
                </div>
                <div className="ckItemPrice">{formatEUR(planPrice)}</div>
              </div>
            ) : (
            safeCart.map((it) => (
              <div className="ckItem" key={`${it._id || it.number}-${it.title}`}>
                  <div className="ckThumbWrap">
                    <img
                      className="ckThumb"
                        src={it.image}
                              alt={it.title}
                                />
                    <div className="ckQtyBubble">{it.quantity || 1}</div>
                  </div>
                  <div className="ckItemTitle">{it.title}</div>
                  <div className="ckItemPrice">
                    {formatEUR(parsePrice(it.price || 0) * Number(it.quantity || 1))}
                  </div>
                </div>
              ))
            )}

            <div className="ckPromo">
              <input className="ckInput" placeholder="Code de réduction" />
              <button className="ckApply" type="button" disabled>
                Appliquer
              </button>
            </div>

            <div className="ckTotals">
              <div className="ckLine">
                <span>Total</span>
                <span>{formatEUR(subtotal)}</span>
              </div>
  {/* Expédition */}
  <div className="ckLine">
    <span>Expédition</span>
    <span className="ckSubtitle">
      {isSubscription ? "—" : "Entrer l’adresse de livraison"}
    </span>
  </div>
            
              <div className="ckLine ckBig">
                <span>Total</span>
                <span>
                  <span className="ckCurrency">EUR</span> {formatEUR(subtotal)}
                </span>
              </div>

              <div className="ckMiniCount">{cartCount} article(s)</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
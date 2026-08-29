import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AcheterNumero.css";

// -------------------- PANIER (localStorage) --------------------
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

// -------------------- CLEAN CART (ANTI DOUBLONS) --------------------
const cleanCartDuplicates = () => {
  const cart = readCart();

  const clean = [];
  const map = new Map();

  for (const item of cart) {
    const key = String(item._id);

    if (!map.has(key)) {
      map.set(key, true);
      clean.push(item);
    } else {
      const existing = clean.find((x) => String(x._id) === key);
      if (existing) {
        existing.quantity += item.quantity || 1;
      }
    }
  }

  writeCart(clean);
  window.dispatchEvent(new Event("cartUpdated"));
};

// -------------------- ADD TO CART --------------------
const addToCart = (product) => {
  const cart = readCart();
  const id = String(product._id);

  const existing = cart.find((item) => String(item._id) === id);

  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({
      _id: id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  // ✔ clean AVANT write (important)
  const cleaned = [];
  const map = new Map();

  for (const item of cart) {
    const key = String(item._id);
    if (!map.has(key)) {
      map.set(key, true);
      cleaned.push(item);
    } else {
      const existing = cleaned.find((x) => String(x._id) === key);
      if (existing) {
        existing.quantity += item.quantity || 1;
      }
    }
  }

  writeCart(cleaned);

  window.dispatchEvent(new Event("cartUpdated"));
};
// -------------------- COMPONENT --------------------
export default function AcheterNumero() {
  const [issues, setIssues] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate(); // ✅ ICI
  // ---------------- LOAD DATA FROM MONGODB ----------------
useEffect(() => {
  fetch("http://localhost:5000/api/issues")
    .then((res) => res.json())
    .then((data) => {
      console.log("ALL ISSUES:", data); // 👈 voir tout

      data.forEach((issue) => {
        console.log("IMAGE URL:", issue.image); // 👈 ICI
      });

      setIssues(data);
    })
    .catch((err) => console.error("API error:", err));
}, []);

  // ---------------- CART COUNT ----------------
  useEffect(() => {
    const cart = readCart();
    setCartCount(cart.reduce((sum, item) => sum + (item.quantity || 1), 0));

    const onStorage = (e) => {
      if (e.key === "cart") {
        const updated = readCart();
        setCartCount(
          updated.reduce((sum, item) => sum + (item.quantity || 1), 0)
        );
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ---------------- UI ----------------
  return (
    <div className="anPage">
     
      <section className="anGrid">
        {issues.map((issue) => (
          <div key={issue._id}className="anCardLink">

            {/* CARD */}
            <div className="anCard">

              {/* IMAGE + BUTTON */}
              <div className="anCoverWrap">

                <img
                  className="anCover"
                  src={issue.image}
                  alt={issue.title}
                />

                {issue.isSoldOut ? (
                  <div className="anSoldOutCircle">
                    <span>ÉPUISÉ</span>
                  </div>
                ) : (
<button
  className="anAddBtn"
  onClick={() => {
    navigate(`/acheter/numero/${issue.number}`);
  }}
>
  Voir le produit
</button>
                )}
              </div>

              {/* INFOS */}
              <div className="anInfo">
                <div className="anIssueTitle">
                  {issue.title}
                </div>

                <div className="anPrice">
  {Number(issue.price).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  })}
</div>
              </div>

            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
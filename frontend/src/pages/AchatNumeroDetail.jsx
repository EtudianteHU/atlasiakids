import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CartAddedModal from "../components/CartAddedModal";
import "./AchatNumeroDetail.css";

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
};

export default function AchatNumeroDetail() {
  const { number } = useParams(); // ✅ FIX

  const [issue, setIssue] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addedItem, setAddedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // 🔥 FETCH MONGODB
  useEffect(() => {
    fetch("http://localhost:5000/api/issues")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find(
          (i) => String(i.number) === String(number)
        );
           console.log("ISSUE =", found); // 👈 ICI
        setIssue(found || null);
      })
      .catch((err) => console.error(err));
  }, [number]);

  if (!issue) {
    return <h2 className="detailNotFound">Magazine introuvable</h2>;
  }

  // ---------------- ADD TO CART ----------------
// ---------------- ADD TO CART ----------------
const addToCartAndShowModal = () => {
  const cart = readCart();

  const idx = cart.findIndex(
    (i) => String(i._id) === String(issue._id)
  );

  let itemForModal;

  if (idx >= 0) {
    cart[idx] = {
      ...cart[idx],
      quantity: (cart[idx].quantity || 1) + quantity,
    };
    itemForModal = cart[idx];
  } else {
    itemForModal = {
      _id: issue._id,
      title: issue.title,
      price: issue.price,
      image: issue.image,
      quantity,
    };
    cart.push(itemForModal);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  window.dispatchEvent(new Event("cartUpdated"));

  setAddedItem(itemForModal);
  setModalOpen(true);
};

  const decreaseQty = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const increaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <>
      <div className="detailPage">
        <div className="detailContainer">

          {/* IMAGE */}
          <div className="detailImageSection">
            <img
              src={issue.image}
              alt={issue.title}
              className="detailMainImage"
            />
          </div>

          {/* INFOS */}
          <div className="detailInfo">
            <h1 className="detailTitle">{issue.title}</h1>

            <p className="detailPrice">
              {Number(issue.price).toFixed(2)} €
            </p>

            <p>Magazine N°{issue.number}</p>

            <div className="detailQtyRow">
              <span>Qté :</span>

              <div className="detailQtyBox">
                <button onClick={decreaseQty}>-</button>
                <div>{quantity}</div>
                <button onClick={increaseQty}>+</button>
              </div>
            </div>

            <button onClick={addToCartAndShowModal}>
              🛒 Ajouter au panier
            </button>
          </div>
        </div>

        <CartAddedModal
          open={modalOpen}
          addedItem={addedItem}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </>
  );
}
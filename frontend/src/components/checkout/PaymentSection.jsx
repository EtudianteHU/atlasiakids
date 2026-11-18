import React from "react";
import { PayPalOneTimePaymentButton } from "@paypal/react-paypal-js/sdk-v6";

const API_URL = process.env.REACT_APP_API_URL;

export default function PaymentSection({
  paymentMethod,
  setPaymentMethod,
  formData,
  items,
  totalAmount,
  isSubscription,
  validateForm,
  loading,
  setLoading,
}) {
  const handleStripePay = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/checkout/create-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          customer: { ...formData, email: formData.email },
          items,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.message || "Erreur Stripe");
      window.location.href = data.url;
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  const handlePayPalCreateOrder = async () => {
    if (!validateForm()) throw new Error("Formulaire invalide");
    const res = await fetch(`${API_URL}/api/paypal/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        customer: { ...formData, email: formData.email },
        items,
        totalAmount,
      }),
    });
    const data = await res.json();
    const orderId = data.orderId || data.id;
    if (!res.ok || !orderId) throw new Error(data.message || "Erreur PayPal");
    return { orderId };
  };

  const handlePayPalApprove = async (data) => {
    try {
      setLoading(true);
      const approvedOrderId = data.orderId || data.orderID || data.id;

      const res = await fetch(`${API_URL}/api/paypal/capture-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: approvedOrderId,
          orderID: approvedOrderId,
          email: formData.email,
          customer: { ...formData, email: formData.email },
          items,
          totalAmount,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Validation PayPal échouée");
      }

      if (!isSubscription) {
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
      }

      window.location.href = `/success?paypal=true&email=${encodeURIComponent(
        formData.email
      )}&amount=${totalAmount}`;
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="ckSection">
      <h2 className="ckH2">Paiement</h2>
      <p className="ckSmall">Toutes les transactions sont sécurisées et chiffrées.</p>

      <div
        className="ckPayBox"
        onClick={() => setPaymentMethod("stripe")}
        style={{ cursor: "pointer" }}
      >
        <div className="ckPayTop">
          <label className="ckRadio">
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "stripe"}
              onChange={() => setPaymentMethod("stripe")}
            />
            Carte bancaire
          </label>
          <div className="ckBadges">
            <span>
              <svg width="34" height="12" viewBox="0 0 38 12" fill="none" xmlns="http://w3.org">
                <path d="M15.4 0.3L12.8 11.7H15.9L18.5 0.3H15.4ZM26.8 7.6L28.4 3.2L29.3 7.6H26.8ZM30.3 11.7H33.2L30.7 0.3H28.1C27.5 0.3 27 0.6 26.8 1.2L22.3 11.7H25.5L26.1 10H30L30.3 11.7ZM22.2 8C22.2 5 18 4.8 18 3.5C18 3.1 18.4 2.7 19.3 2.6C19.8 2.5 21.1 2.5 22.5 3.1L23.1 0.6C22.3 0.3 21.3 0 20 0C16.9 0 14.8 1.6 14.8 4C14.8 5.7 16.4 6.7 17.6 7.3C18.8 7.9 19.2 8.3 19.2 8.8C19.2 9.6 18.2 10 17.3 10C15.7 10 14.8 9.6 14.1 9.2L13.5 11.8C14.3 12.1 15.7 12.4 17.1 12.4C20.4 12.4 22.2 10.8 22.2 8ZM11.9 0.3L7 11.7H3.7L1.3 2.6C1.1 2 0.9 1.8 0.4 1.5C-0.3 1.1 -1.5 0.8 -2.5 0.6L-2.4 0.3H2.8C3.5 0.3 4.1 0.7 4.2 1.5L5.5 8.3L8.6 0.3H11.9Z" fill="#1434CB"/>
              </svg>
            </span>
            <span>
              <svg width="26" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://w3.org">
                <circle cx="8.5" cy="8" r="7" fill="#EB001B"/>
                <circle cx="15.5" cy="8" r="7" fill="#F79E1B" fillOpacity="0.85"/>
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div
        className="ckPayBox"
        onClick={() => setPaymentMethod("paypal")}
        style={{ cursor: "pointer" }}
      >
        <div className="ckPayTop">
          <label className="ckRadio">
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "paypal"}
              onChange={() => setPaymentMethod("paypal")}
            />
            PayPal
          </label>
        </div>
      </div>

      {paymentMethod === "stripe" ? (
        <button type="button" className="ckPayBtn" onClick={handleStripePay} disabled={loading}>
          {loading ? "Redirection..." : "Payer maintenant"}
        </button>
      ) : (
        <div style={{ marginTop: "20px" }}>
          <PayPalOneTimePaymentButton
            createOrder={handlePayPalCreateOrder}
            onApprove={handlePayPalApprove}
          />
        </div>
      )}
    </div>
  );
}

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
          <span
  style={{
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "24px",
    padding: "0 10px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#fff",
    color: "#1434CB",
    fontWeight: "900",
    fontStyle: "italic",
    fontSize: "13px",
    letterSpacing: "0.5px",
  }}
>
  VISA
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

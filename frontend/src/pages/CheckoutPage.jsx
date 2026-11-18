import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./CheckoutPage.css";
import CustomerForm from "../components/checkout/CustomerForm";
import PaymentSection from "../components/checkout/PaymentSection";
import OrderSummary from "../components/checkout/OrderSummary";
import { readCart, parsePrice } from "../utils/checkoutHelpers";

export default function CheckoutPage() {
  const { state } = useLocation();
  const abonnement = state?.abonnement;
  const isSubscription = Boolean(abonnement);

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [formData, setFormData] = useState({
    email: "", phone: "", country: "France", firstName: "",
    lastName: "", company: "", address: "", postalCode: "", city: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    if (abonnement) return;
    const load = () => setCart(readCart());
    load();
    window.addEventListener("cartUpdated", load);
    return () => window.removeEventListener("cartUpdated", load);
  }, [abonnement]);

  const safeCart = useMemo(() =>
    Array.isArray(cart)
      ? cart.filter((i) => i && typeof (i._id || i.productId) === "string" && i.title && i.price != null)
      : []
  , [cart]);

  const subtotal = useMemo(() => {
    if (isSubscription) return formData.country === "Suisse" ? 94 : 84;
    return safeCart.reduce((sum, item) => {
      const price = formData.country === "Suisse" ? 8.99 : parsePrice(item.price);
      return sum + price * Number(item.quantity || 1);
    }, 0);
  }, [safeCart, isSubscription, formData.country]);

  const items = useMemo(() =>
    isSubscription
      ? [{ productId: "abonnement_annuel", type: "subscription", quantity: 1 }]
      : safeCart.map((i) => ({ productId: String(i._id || i.productId), type: "product", quantity: Number(i.quantity || 1) }))
  , [isSubscription, safeCart]);

  const validateForm = () => {
    const { email, firstName, lastName, address, postalCode, city } = formData;
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

  return (
    <div className="ckPage">
      <div className="ckShell">
        {/* SOL SÜTUN */}
        <div className="ckLeft">
          <CustomerForm formData={formData} onChange={handleChange} />

          <PaymentSection
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            formData={formData}
            items={items}
            totalAmount={subtotal}
            isSubscription={isSubscription}
            validateForm={validateForm}
            loading={loading}
            setLoading={setLoading}
          />

          <div className="ckFooterLinks">
            <Link to="/conditions">Conditions générales</Link>
            <Link to="/privacy-policy">Confidentialité</Link>
            <Link to="/annulations">Annulations</Link>
          </div>
        </div>

        {/* SAĞ SÜTUN */}
        <div className="ckRight">
          <OrderSummary
            safeCart={safeCart}
            isSubscription={isSubscription}
            country={formData.country}
            subtotal={subtotal}
          />
        </div>
      </div>
    </div>
  );
}

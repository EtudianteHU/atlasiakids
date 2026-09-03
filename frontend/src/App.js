import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import CheckoutLayout from "./layouts/CheckoutLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import FAQ from "./pages/Faq.jsx";
import NumeroActuel from "./pages/NumeroActuel";
import Contact from "./pages/Contact";
import Abonnement from "./pages/Abonnement";
import Magazine from "./pages/magazine";
import Error from "./pages/Error"
import AcheterNumero from "./pages/AcheterNumero";
import AchatNumeroDetail from "./pages/AchatNumeroDetail";
import Panier from "./pages/Panier";
import PrivacyPolicyPage from "./pages/privacy-policy.jsx";
import CheckoutPage from "./pages/CheckoutPage";
import SuccessPage from "./pages/SuccesPage";
import CancelPage from "./pages/CancelPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ConditionsGeneralesPage from "./pages/ConditionsGeneralesPage";
import Annulations from "./pages/Annulations";
import Loading from "./pages/Loading";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ScrollToTopButton from "./components/ScrollToTopButton";
import CookieBanner from "./components/CookieBanner";
import MentionsLegalesPage from "./pages/MentionLegal.jsx";
import { useEffect } from "react";
export default function App() {
useEffect(() => {
  const dot = document.querySelector(".cursor-dot");

  if (!dot) return;

  const move = (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
  };

  window.addEventListener("mousemove", move);

  return () => window.removeEventListener("mousemove", move);
}, []);

useEffect(() => {
  fetch("https://atlasiakids-backend.onrender.com/")
    .catch(() => {});
}, []);
  return (
    <Router>

  {/* 🔵 GLOBAL CURSOR */}
  <div
    className="cursor-dot"
  />
       <CookieBanner />
        <ScrollToTop />   {/* 👈 ICI */}
         <ScrollToTopButton />  {/* 👈 AJOUTE ICI */}
      <AuthProvider>
      <Routes>
        {/* ✅ Site normal : Navbar + Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<Error/>} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/current-issue" element={<NumeroActuel />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/abonnement" element={<Abonnement />} />
          <Route path="/Magazine" element={<Magazine />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
        </Route>

        {/* ✅ Achat / Panier / Checkout : layout spécial */}
        <Route element={<CheckoutLayout />}>
          {/* Pages ACHAT avec BuyerNavbar (géré dans CheckoutLayout) */}
          <Route path="/acheter/numero" element={<AcheterNumero />} />
         <Route path="/acheter/numero/:number" element={<AchatNumeroDetail />} />
          <Route path="/panier" element={<Panier />} />
          {/* Checkout (sans navbar) */}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
          <Route path="/conditions" element={<ConditionsGeneralesPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/annulations" element={<Annulations />} />
                <Route path="/mentionLegal" element={<MentionsLegalesPage />} />
              <Route path="/loading" element={<Loading />} />
        </Route>

        {/* ✅ 404 */}
        <Route path="*" element={<div>404 - Page introuvable</div>} />
      </Routes>
      </AuthProvider>
    </Router>
  );
}
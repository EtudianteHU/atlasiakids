import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import BuyerNavbar from "../components/BuyerNavbar";
import FooterBuyer from "../components/FooterBuyer";

export default function CheckoutLayout() {
  const { pathname } = useLocation();

  const showBuyerNavbar =
    pathname === "/panier" ||
    pathname.startsWith("/acheter/numero") ||
    pathname === "/annulations" ||
    pathname === "/privacy-policy" ||
    pathname === "/conditions" ||
    pathname === "/loading" ||
    pathname === "/mentionLegal";

  const showFooterBuyer = showBuyerNavbar;

  return (
    <div className="page-layout">
      {showBuyerNavbar && <BuyerNavbar />}

      <main className="page-content">
        <Outlet />
      </main>

      {showFooterBuyer && (
        <div className="footer-wrapper">
          <FooterBuyer />
        </div>
      )}
    </div>
  );
}
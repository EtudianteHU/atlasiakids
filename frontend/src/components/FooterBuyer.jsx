import React from "react";
import "./FooterBuyer.css";
import { FaHome, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../images/logo-t.png";

export default function FooterBuyer() {
  return (
    <footer className="footer">

      <div className="footer-inner">

        {/* LOGO */}
        <div className="footer-col footer-brand">
          <img src={logo} alt="Atlasia Kids" className="footer-logo" />
        </div>

        {/* LIENS RAPIDES */}
        <div className="footer-col">
          <h3 className="footer-title">Liens rapides</h3>
          <ul className="footer-links">
            <li><Link to="/about">À propos de nous</Link></li>
            <li><Link to="/abonnement">Abonnez-vous maintenant</Link></li>
          </ul>
        </div>

        {/* INFORMATION */}
        <div className="footer-col">
          <h3 className="footer-title">Information</h3>
          <ul className="footer-links">
            <li><Link to="/privacy-policy">Politique de confidentialité</Link></li>
            <li><Link to="/conditions">Conditions générales</Link></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="footer-col">
          <h3 className="footer-title">Contacts</h3>

          <div className="footer-contactItem">
            <FaHome />
            <p> 7 Rue Pasteur ,<br />
              91260 Juvisy-sur-Orge</p>
          </div>

          <div className="footer-contactItem">
            <FaPhoneAlt />
            <p>+33766700248</p>
          </div>

          <div className="footer-contactItem">
            <FaEnvelope />
            <p>@atlasiakidsfr</p>
          </div>

        </div>

      </div>

      <div className="footer-bottom">
        Copyright © 2026, Atlasia Kids
      </div>

    </footer>
  );
}
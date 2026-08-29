import React from "react";
import "./Footer.css";
import hills from "../images/HP7.png";

export default function Footer() {
  return (
    <footer
      className="akFooter"
      style={{ backgroundImage: `url("${hills}")` }}
    >
      <div className="akFooterInner">
        <div className="akCol akBrand">
          <img
            className="akLogo"
            src="https://atlasiakids.com/wp-content/uploads/2025/04/logo-new.png"
            alt="Atlasia Kids"
          />

          <p className="akDesc">
            Atlasia Kids est un magazine divertissant et imprégné de foi, créé
            spécialement pour les jeunes lecteurs.
          </p>

          <div className="akSocial" aria-label="Réseaux sociaux">
            <a
              href="https://www.instagram.com/atlasiakidsfr/"
              target="_blank"
              rel="noopener noreferrer"
              className="akSocialLink"
              aria-label="Instagram"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                alt="Instagram"
                className="akSocialIcon"
              />
            </a>
          </div>
        </div>

        <div className="akCol">
          <h4 className="akTitle">Liens Utiles</h4>
          <ul className="akList">
            <li><a className="akLink" href="/About">À propos de nous</a></li>
            <li><a className="akLink" href="/faq">Aide et FAQ</a></li>
            <li><a className="akLink" href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="akCol">
          <h4 className="akTitle">Contactez-Nous</h4>

          <div className="akContact">
            <div className="akLabel">Adresse:</div>
            <div className="akValue">
              7 Rue Pasteur ,<br />
              91260 Juvisy-sur-Orge
            </div>

            <div className="akLabel">Téléphone:</div>
            <div className="akValue">+33766700248</div>

            <div className="akLabel">Instagram :</div>
            <div className="akValue">
              <a
                href="https://www.instagram.com/atlasiakidsfr/"
                target="_blank"
                rel="noopener noreferrer"
                className="akLink"
              >
                @atlasiakidsfr
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="akCopy">Atlasia Kids © 2025 Tous droits réservés.</div>
    </footer>
  );
}
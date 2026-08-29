import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";
import logoAtlasia from "../images/logoAtlasia.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const dropdownRef = useRef(null);

  // Fermer le menu
  const closeMenu = () => {
    setIsOpen(false);
    setShowAbout(false);
  };

  // Fermer le menu lorsqu'on change de page
  useEffect(() => {
    setIsOpen(false);
    setShowAbout(false);
  }, [location.pathname]);

  // Détecter le scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    // Vérifier également la position au chargement
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fermer le dropdown lorsqu'on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowAbout(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const aboutPaths = [
    "/about",
    "/faq",
    "/guide",
    "/exemple",
    "/blog",
  ];

  const isAboutActive = aboutPaths.includes(location.pathname);

  return (
    <header
      className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}
    >
      <div className="navbar-container">

        {/* Logo */}
        <div className="navbar-logoWrapper">
          <img
            src="https://atlasiakids.com/wp-content/uploads/2025/04/logo-new.png"
            alt="Atlasia Kids"
            className="navbar-logo"
          />
        </div>

        {/* Bouton menu mobile */}
        <button
          type="button"
          className="hamburger"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={
            isOpen ? "Fermer le menu" : "Ouvrir le menu"
          }
          aria-expanded={isOpen}
        >
          <img
            src={logoAtlasia}
            alt="Menu"
            className="menu-image"
          />
        </button>

        {/* Menu */}
        <ul
          className={`nav-links ${isOpen ? "active" : ""}`}
        >

          {/* Bouton fermer mobile */}
          <button
            type="button"
            className="mobile-menu-close"
            onClick={closeMenu}
            aria-label="Fermer le menu"
          >
            ×
          </button>

          {/* Accueil */}
          <li>
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              Accueil
            </NavLink>
          </li>

          {/* À propos */}
          <li
            className="aboutDropdown"
            ref={dropdownRef}
          >
            <button
              type="button"
              className={`aboutTrigger ${
                isAboutActive ? "active" : ""
              }`}
              onClick={() =>
                setShowAbout((prev) => !prev)
              }
            >
              À propos
            </button>

            {showAbout && (
              <div className="aboutMenu show">

                <NavLink
                  to="/about"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  À propos de nous
                </NavLink>

                <NavLink
                  to="/faq"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  Aide et FAQ
                </NavLink>

              </div>
            )}
          </li>

          {/* Numéro actuel */}
          <li>
            <NavLink
              to="/current-issue"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              Numéro actuel
            </NavLink>
          </li>

          {/* Acheter un numéro */}
          <li>
            <NavLink
              to="/acheter/numero"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              Acheter Numéro Individuel
            </NavLink>
          </li>

          {/* Contact */}
          <li>
            <NavLink
              to="/contact"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              Contact
            </NavLink>
          </li>

          {/* Abonnement */}
          <li>
            <NavLink
              to="/abonnement"
              className="subscribe-btn"
              onClick={closeMenu}
            >
              Abonnez-vous Maintenant
            </NavLink>
          </li>

        </ul>
      </div>
    </header>
  );
}
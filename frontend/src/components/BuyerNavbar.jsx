import React, { useEffect, useRef, useState } from "react";
import "./BuyerNavbar.css";
import MiniCart from "../components/MiniCart";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../images/logo-t.png"; // adapte le chemin

export default function BuyerNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [openUser, setOpenUser] = useState(false);
  const userRef = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (!openUser) return;
      if (userRef.current && !userRef.current.contains(e.target)) {
        setOpenUser(false);
      }
    };

    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [openUser]);

  return (
    <div className="buyerNavWrap">
      <nav className="buyerNav">
        <div className="buyerNav__left">
          <div
            className="buyerNav__logo"
            aria-label="ATLASIA Kids"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <img src={logo} alt="Atlasia Kids" className="buyerNav__logoImg" />
          </div>
        </div>

        <div className="buyerNav__center">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `buyerNav__link ${isActive ? "active" : ""}`
            }
          >
            À PROPOS DE NOUS
          </NavLink>

          <NavLink
            to="/abonnement"
            className={({ isActive }) =>
              `buyerNav__link ${isActive ? "active" : ""}`
            }
          >
            ABONNEZ-VOUS MAINTENANT
          </NavLink>
    
        </div>

        <div className="buyerNav__right">
          <div className="buyerNavUser" ref={userRef}>
            <button
              className="buyerNav__login"
              type="button"
              onClick={() => setOpenUser((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={openUser}
            >
              <span className="buyerNav__userIcon" aria-hidden="true">
                👤
              </span>
              <span>{user ? user.firstName : "Se connecter"}</span>
            </button>

            {openUser && (
              <div className="buyerNavUserMenu" role="menu">
                {user ? (
                  <>
                    <div className="buyerNavUserInfo">
                      {user.firstName} {user.lastName}
                    </div>

                    <button
                      className="buyerNavUserItem"
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setOpenUser(false);
                        logout();
                        navigate("/");
                      }}
                    >
                      <span className="ico" aria-hidden="true">
                        🚪
                      </span>
                      <span>Se déconnecter</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="buyerNavUserItem"
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setOpenUser(false);
                        navigate("/login");
                      }}
                    >
                      <span className="ico" aria-hidden="true">
                        ↪️
                      </span>
                      <span>Se connecter</span>
                    </button>

                    <button
                      className="buyerNavUserItem"
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setOpenUser(false);
                        navigate("/register");
                      }}
                    >
                      <span className="ico" aria-hidden="true">
                        👤
                      </span>
                      <span>Créer un compte</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <MiniCart />
        </div>
      </nav>
    </div>
  );
}
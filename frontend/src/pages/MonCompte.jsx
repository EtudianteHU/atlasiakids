import React from "react";
import { useAuth } from "../context/AuthContext";
import "./MonCompte.css";
import { useNavigate } from "react-router-dom";
export default function MonCompte() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
 const handleLogout = () => {
    logout();
    navigate("/loading"); // 🔥 redirection
  };
  return (
    <div className="accountPage">
      <div className="accountCard">
        <h1>Mon compte</h1>

        <p>
          <strong>Prénom :</strong> {user?.firstName || "-"}
        </p>

        <p>
          <strong>Nom :</strong> {user?.lastName || "-"}
        </p>

        <p>
          <strong>Email :</strong> {user?.email || "-"}
        </p>

        <button className="accountBtn" onClick={handleLogout }>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
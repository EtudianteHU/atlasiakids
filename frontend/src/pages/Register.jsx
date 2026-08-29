import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";
import logo from "../images/logo-t.png"; // <-- ajoutez votre image ici

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !firstName || !lastName) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de l'inscription");
      loginUser(data);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authLogo">
          <img src={logo} alt="Logo" className="logoImage" />
        </div>

        <h1>Créer un compte</h1>
        <p className="authSub">Rejoignez l'aventure Atlasia Kids</p>

        {error && <div className="authError">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="authRow">
            <div className="authField">
              <label>Prénom</label>
              <input
                type="text"
                placeholder="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="authField">
              <label>Nom</label>
              <input
                type="text"
                placeholder="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="authField">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="authField">
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="Min. 6 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="authField">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <button className="authBtn" type="submit" disabled={loading}>
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <div className="authBottom">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}

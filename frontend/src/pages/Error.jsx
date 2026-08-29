

import React from "react";
import { Link } from "react-router-dom";
import "./Error.css";

import landscape from "../images/404-background.png";
import characters from "../images/404.png";

export default function Error() {
  return (
    <div
      className="errorPage"
      style={{ backgroundImage: `url(${landscape})` }}
    >
      <div className="errorContainer">

        <div className="errorLeft">
          <img
            src={characters}
            alt="404 illustration"
            className="errorCharacters"
          />
        </div>

        <div className="errorRight">
          <h1>Oups ! Cette page est introuvable.</h1>

          <p>
            Il semble qu'aucun résultat n'ait été trouvé à cet endroit.
            Essayez peut-être l'un des liens ci-dessous ou effectuez une recherche.
          </p>

          <Link to="/" className="errorBtn">
            Retour à l'accueil
          </Link>
        </div>

      </div>
    </div>
  );
}
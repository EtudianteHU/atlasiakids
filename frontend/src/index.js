import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // IMPORTANT
const container = document.getElementById("root");

console.log("ROOT =", container); // 👈 IMPORTANT DEBUG

if (container) {
  ReactDOM.createRoot(container).render(<App />);
} else {
  console.error("ROOT introuvable !");
}
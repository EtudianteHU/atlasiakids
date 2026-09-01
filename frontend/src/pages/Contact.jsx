import React, { useState } from "react";
import HeroAbonnement from "../sections/HeroAbonnement";
import "./Contact.css";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setIsSending(true);

    try {
    const res = await fetch("https://atlasiakids-backend.onrender.com/api/contact",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

  if (data.success) {
  setStatus(data.message || "Message envoyé ✅");

  setForm({
    nom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: "",
  });

  setTimeout(() => {
    setStatus("");
  }, 3000);
}else {
        setStatus(data.message || "Erreur lors de l'envoi ❌");
      }
    } catch (err) {
      setStatus("Erreur serveur ❌");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <HeroAbonnement
        buttonText="Contactez-Nous"
        title="Pour nous contacter !"
        description="Que vous ayez une question, une suggestion ou que vous souhaitiez simplement nous saluer, nous sommes là pour vous et ravis d'échanger avec vous ! Remplissez le formulaire pour nous contacter : nous vous répondrons dans les plus brefs délais !"
         buttonTo="/contact"
    />

      <section className="contactSection">
        <div className="contactContainer">
          <div className="contactLeft">
            <h2 className="contactTitle">
              Nous serions ravis d’avoir <br />
              de vos nouvelles !
            </h2>

            <div className="contactInfo">
              <div className="infoItem">
                <MapPin size={22} className="infoIcon" />
                <div>
                  <h4>Adresse :</h4>
                  <p>   7 Rue Pasteur ,<br />
              91260 Juvisy-sur-Orge</p>
                </div>
              </div>

              <div className="infoItem">
                <Phone size={22} className="infoIcon" />
                <div>
                  <h4>Téléphone :</h4>
            <p>+33766700248</p>
                  <p></p>
                </div>
              </div>

              <div className="infoItem">
                <Mail size={22} className="infoIcon" />
                <div>
                  <h4>Courriel :</h4>
                  <p>atlasiakidsfr</p>
                </div>
              </div>
            </div>
          </div>

          <form className="contactForm" onSubmit={handleSubmit}>
            <div className="grid2">
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                value={form.nom}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="E-Mail"
                value={form.email}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="telephone"
                placeholder="Téléphone"
                value={form.telephone}
                onChange={handleChange}
              />

              <input
                type="text"
                name="sujet"
                placeholder="Sujet"
                value={form.sujet}
                onChange={handleChange}
              />
            </div>

            <textarea
              name="message"
              placeholder="Message"
              value={form.message}
              onChange={handleChange}
              required
            />

            <button type="submit" className="contactBtn" disabled={isSending}>
              {isSending ? "Envoi en cours..." : "Envoyer un message"}
            </button>

            {status && <p className="status">{status}</p>}
          </form>
        </div>
      </section>
    </>
  );
}
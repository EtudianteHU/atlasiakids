import React from "react";

export default function CustomerForm({ formData, onChange }) {
  return (
    <div className="ckSection">
      <h2 className="ckH2">Contact</h2>
      <input
        className="ckInput"
        name="email"
        type="email"
        placeholder="E-mail *"
        value={formData.email}
        onChange={onChange}
        required
      />

      <h2 className="ckH2" style={{ marginTop: "24px" }}>Livraison</h2>
      <label className="ckLabel">Pays / Région</label>
      <select className="ckInput" name="country" value={formData.country} onChange={onChange}>
          <option value="Belgique">Belgique</option>
        <option value="France">France</option>
        <option value="Suisse">Suisse</option>
      </select>s

      <div className="ckGrid2" style={{ marginTop: "12px" }}>
        <input className="ckInput" name="firstName" placeholder="Prénom *" value={formData.firstName} onChange={onChange} required />
        <input className="ckInput" name="lastName" placeholder="Nom *" value={formData.lastName} onChange={onChange} required />
      </div>

      <input className="ckInput" style={{ marginTop: "12px" }} name="company" placeholder="Entreprise (optionnel)" value={formData.company} onChange={onChange} />
      <input className="ckInput" style={{ marginTop: "12px" }} name="address" placeholder="Adresse *" value={formData.address} onChange={onChange} required />

      <div className="ckGrid2" style={{ marginTop: "12px" }}>
        <input className="ckInput" name="postalCode" placeholder="Code postal *" value={formData.postalCode} onChange={onChange} required />
        <input className="ckInput" name="city" placeholder="Ville *" value={formData.city} onChange={onChange} required />
      </div>

      <input className="ckInput" style={{ marginTop: "12px" }} name="phone" placeholder="Téléphone (optionnel)" value={formData.phone} onChange={onChange} />
    </div>
  );
}

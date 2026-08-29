import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
  
    const consent = localStorage.getItem("cookie_consent");

    if (!consent) {
      setVisible(true);
    }

    if (consent === "accepted") {
      loadAnalytics();
    }
  }, []);

  // 👉 Exemple analytics (à remplacer par Google Analytics si besoin)
  const loadAnalytics = () => {
    console.log("Analytics activé");
  };

  const acceptAll = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
    loadAnalytics();
  };

  const refuseAll = () => {
    localStorage.setItem("cookie_consent", "refused");
    setVisible(false);
  };

  const saveCustom = (analyticsAllowed) => {
    localStorage.setItem(
      "cookie_consent",
      analyticsAllowed ? "accepted_custom" : "refused_custom"
    );

    if (analyticsAllowed) loadAnalytics();

    setVisible(false);
    setShowSettings(false);
  };

  if (!visible) return null;

  return (
    <div style={styles.banner}>
      <p>🍪 Nous utilisons des cookies pour améliorer ton expérience.</p>

      {!showSettings ? (
        <div style={styles.buttons}>
          <button onClick={acceptAll} style={styles.accept}>
            Tout accepter
          </button>

          <button onClick={refuseAll} style={styles.refuse}>
            Refuser
          </button>

          <button onClick={() => setShowSettings(true)}>
            Personnaliser
          </button>
        </div>
      ) : (
        <CustomSettings onSave={saveCustom} />
      )}
    </div>
  );
}

// -------------------------
// ⚙️ SETTINGS COMPONENT
// -------------------------
function CustomSettings({ onSave }) {
  const [analytics, setAnalytics] = useState(false);

  return (
    <div>
      <h4>Paramètres des cookies</h4>

      <label>
        <input
          type="checkbox"
          checked={analytics}
          onChange={(e) => setAnalytics(e.target.checked)}
        />
        Cookies de statistiques (analytics)
      </label>

      <div style={{ marginTop: 10 }}>
        <button onClick={() => onSave(analytics)}>
          Sauvegarder
        </button>
      </div>
    </div>
  );
}

// -------------------------
// 🎨 STYLES
// -------------------------

const styles = {
  banner: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "white",
    padding: "18px 20px",
    borderTop: "2px solid #eee",
    zIndex: 9999,
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
    borderRadius: "12px 12px 0 0",
    width:"500px",
  },

  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
    flexWrap: "wrap",
  },

  accept: {
    background: "#2ecc71",
    color: "white",
    padding: "10px 14px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  refuse: {
    background: "#95a5a6",
    color: "white",
    padding: "10px 14px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  }
};
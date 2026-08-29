export const loadGoogleAnalytics = () => {
  if (window.gtag) return; // éviter double chargement

  const script = document.createElement("script");
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX";
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }

  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", "G-XXXXXXX");
};

export const loadFacebookPixel = () => {
  console.log("Facebook Pixel chargé");
  // ajoute ici le vrai script si besoin
};
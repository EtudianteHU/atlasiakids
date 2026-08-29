import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // bloque restauration navigateur Chrome
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const scroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scroll();

    // sécurité après render + images + banner + layout shift
    const id1 = requestAnimationFrame(scroll);
    const id2 = setTimeout(scroll, 0);
    const id3 = setTimeout(scroll, 50);
    const id4 = setTimeout(scroll, 150);

    return () => {
      cancelAnimationFrame(id1);
      clearTimeout(id2);
      clearTimeout(id3);
      clearTimeout(id4);
    };
  }, [pathname]);

  return null;
}
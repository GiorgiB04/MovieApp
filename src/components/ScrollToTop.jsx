import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    setTimeout(() => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }

      // Attempt all known ways
      window.scrollTo(0, 0);

      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      const scrollingElement =
        document.scrollingElement || document.documentElement;
      if (scrollingElement) {
        scrollingElement.scrollTop = 0;
      }
    }, 50); // მცირე დაგვიანება
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;

"use client";

import { useEffect } from "react";

const idFromPath = () => window.location.pathname.replace(/^\/+|\/+$/g, "") || "top";

function scrollToId(id: string, behavior: ScrollBehavior) {
  if (id === "top") window.scrollTo({ top: 0, behavior });
  else document.getElementById(id)?.scrollIntoView({ behavior });
}

/** Opens the page scrolled to `section`, and follows the back/forward buttons between sections. */
export function SectionScroller({ section }: { section?: string }) {
  useEffect(() => {
    if (section) {
      // wait a frame so fonts and layout settle before jumping
      requestAnimationFrame(() => scrollToId(section, "instant"));
    }
    const onPop = () => scrollToId(idFromPath(), "smooth");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [section]);

  return null;
}

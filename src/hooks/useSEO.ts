import { useEffect } from "react";

interface SEOOptions {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: "website" | "article";
  jsonLd?: object;
  canonical?: string;
}

const SITE_URL = "https://catscape.sg";
const DEFAULT_OG_IMAGE = "https://lovable.dev/opengraph-image-p98pqg.png";

const setTag = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setLink = (rel: string, href: string) => {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

export const useSEO = ({
  title,
  description,
  keywords,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  jsonLd,
  canonical,
}: SEOOptions) => {
  useEffect(() => {
    const fullTitle = title.includes("CatScape") ? title : `${title} | CatScape SG`;
    document.title = fullTitle;

    setTag("name", "description", description);
    if (keywords?.length) setTag("name", "keywords", keywords.join(", "));

    setTag("property", "og:title", fullTitle);
    setTag("property", "og:description", description);
    setTag("property", "og:type", ogType);
    setTag("property", "og:image", ogImage);
    setTag("property", "og:url", canonical || `${SITE_URL}${window.location.pathname}`);

    setTag("name", "twitter:card", "summary_large_image");
    setTag("name", "twitter:title", fullTitle);
    setTag("name", "twitter:description", description);
    setTag("name", "twitter:image", ogImage);

    if (canonical) setLink("canonical", canonical);

    // JSON-LD structured data
    const existing = document.getElementById("page-jsonld");
    if (existing) existing.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "page-jsonld";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const el = document.getElementById("page-jsonld");
      if (el) el.remove();
    };
  }, [title, description, keywords, ogImage, ogType, jsonLd, canonical]);
};

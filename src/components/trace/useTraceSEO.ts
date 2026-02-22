import { useEffect } from "react";

interface TraceSEOProps {
  batchRef: string;
  cooperativeName?: string;
  breed?: string;
  grade?: string;
  packageDate?: string;
}

export function useTraceSEO({ batchRef, cooperativeName, breed, grade, packageDate }: TraceSEOProps) {
  useEffect(() => {
    const title = `Lot ${batchRef} — Biovolailles Union Trace`;
    const description = `Traçabilité complète du lot ${batchRef}${cooperativeName ? ` — Coopérative ${cooperativeName}` : ""}${breed ? ` — Race ${breed}` : ""}${grade ? ` — Grade ${grade}` : ""}. Vérifiez l'authenticité de vos œufs.`;

    document.title = title;

    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) ||
               document.querySelector(`meta[name="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        if (property.startsWith("og:") || property.startsWith("twitter:")) {
          el.setAttribute("property", property);
        } else {
          el.setAttribute("name", property);
        }
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("og:title", title);
    setMeta("og:description", description);
    setMeta("og:type", "article");
    setMeta("og:url", window.location.href);
    setMeta("twitter:card", "summary");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);

    // JSON-LD structured data
    let script = document.querySelector('script[data-trace-ld]') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-trace-ld", "true");
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: `Lot ${batchRef}`,
      description,
      brand: { "@type": "Brand", name: "Biovolailles Union" },
      manufacturer: cooperativeName ? { "@type": "Organization", name: cooperativeName } : undefined,
      category: "Eggs",
      countryOfOrigin: { "@type": "Country", name: "Morocco" },
    });

    return () => {
      document.title = "Biovolailles Union Trace";
      const ldScript = document.querySelector('script[data-trace-ld]');
      ldScript?.remove();
    };
  }, [batchRef, cooperativeName, breed, grade, packageDate]);
}

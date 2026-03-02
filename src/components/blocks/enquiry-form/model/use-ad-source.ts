import { useState, useEffect } from "react";

type AdSource = "meta" | "google" | undefined;

export function useAdSource() {
  const [sourceName, setSourceName] = useState<AdSource>(undefined);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const utm_source = (params.get("utm_source") || "").toLowerCase();
    const utm_medium = (params.get("utm_medium") || "").toLowerCase();
    const fbclid = params.get("fbclid");
    const gclid = params.get("gclid");
    const gad_source = params.get("gad_source");
    const wbraid = params.get("wbraid");
    const gbraid = params.get("gbraid");

    const isMeta =
      !!fbclid ||
      ["facebook", "fb", "instagram", "ig", "meta"].includes(utm_source) ||
      utm_medium === "paid_social";

    const isGoogle =
      !!gclid ||
      !!gad_source ||
      !!wbraid ||
      !!gbraid ||
      utm_source === "google";

    setSourceName(isMeta ? "meta" : isGoogle ? "google" : undefined);
  }, []);

  return sourceName;
}

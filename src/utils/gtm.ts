declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export const triggerLeadEvent = (): void => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "lead_event",
    leadType: "Kontaktformular",
  });
};



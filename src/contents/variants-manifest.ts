import type { VariantKey } from "./variants-keys";
export { variantKeys, type VariantKey } from "./variants-keys";

export const loadVariantJson: Record<VariantKey, () => Promise<{ default: unknown }>> = {
  "default": () => import("./variants/default.json", { with: { type: "json" } })
};

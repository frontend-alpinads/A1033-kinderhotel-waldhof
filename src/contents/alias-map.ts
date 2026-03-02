import { variantKeys, loadVariantJson, type VariantKey } from "./variants-manifest";

// Cache the alias map to avoid re-loading variants on every request
let aliasMapCache: Map<string, VariantKey> | null = null;

/**
 * Builds a map of path aliases to their corresponding variant keys.
 * e.g., { "spring-summer": "default", "holiday": "v2" }
 */
export async function getAliasMap(): Promise<Map<string, VariantKey>> {
  if (aliasMapCache) return aliasMapCache;

  const map = new Map<string, VariantKey>();

  for (const key of variantKeys) {
    const { default: json } = await loadVariantJson[key]();
    const alias = (json as { routeConfig?: { pathAlias?: string } })?.routeConfig
      ?.pathAlias;
    if (alias) {
      map.set(alias, key);
    }
  }

  aliasMapCache = map;
  return map;
}

/**
 * Gets the alias for a given variant key, if one exists.
 * e.g., getAliasForVariant("default", map) => "spring-summer"
 */
export function getAliasForVariant(
  variantKey: VariantKey,
  aliasMap: Map<string, VariantKey>,
): string | undefined {
  for (const [alias, key] of aliasMap) {
    if (key === variantKey) return alias;
  }
  return undefined;
}

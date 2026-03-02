import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { zodToJsonSchema } from "zod-to-json-schema";
import { VariantSpecSchema } from "../src/contents/schema";
import { variantKeys } from "@/contents/variants-keys";

type VariantEntry = { key: string; filename: string };

async function main() {
  const repoRoot = process.cwd();
  const variantsDir = path.join(repoRoot, "src", "contents", "variants");

  const entries = await readdir(variantsDir, { withFileTypes: true });
  const variants: VariantEntry[] = entries
    .filter((e) => e.isFile() && e.name.endsWith(".json"))
    .map((e) => ({
      key: e.name.replace(/\.json$/, ""),
      filename: e.name,
    }))
    .sort((a, b) => a.key.localeCompare(b.key));

  if (!variants.some((v) => v.key === variantKeys[0])) {
    throw new Error(
      `Missing required variant 'v1'. Please add src/contents/variants/v1.json`,
    );
  }

  // 1) JSON Schema for editor validation
  const jsonSchema = zodToJsonSchema(VariantSpecSchema as any, {
    name: "VariantSpec",
  });
  await writeFile(
    path.join(repoRoot, "src", "contents", "variant-spec.schema.json"),
    JSON.stringify(jsonSchema, null, 2) + "\n",
    "utf8",
  );

  // 2) Variants keys module (safe for client imports)
  await writeFile(
    path.join(repoRoot, "src", "contents", "variants-keys.ts"),
    `export const variantKeys = ${JSON.stringify(
      variants.map((v) => v.key),
    )} as const;\n` +
      `export type VariantKey = (typeof variantKeys)[number];\n`,
    "utf8",
  );

  // 3) Variants manifest for server loader (dynamic imports)
  const importLines = variants
    .map(
      (v) =>
        `  "${v.key}": () => import("./variants/${v.filename}", { with: { type: "json" } })`,
    )
    .join(",\n");

  const manifest =
    `import type { VariantKey } from "./variants-keys";\n` +
    `export { variantKeys, type VariantKey } from "./variants-keys";\n\n` +
    `export const loadVariantJson: Record<VariantKey, () => Promise<{ default: unknown }>> = {\n` +
    `${importLines}\n` +
    `};\n`;

  await writeFile(
    path.join(repoRoot, "src", "contents", "variants-manifest.ts"),
    manifest,
    "utf8",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

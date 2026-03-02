import { readFile, writeFile, unlink, readdir } from "node:fs/promises";
import path from "node:path";

// Track operations for rollback capability (module scope)
const operations: Array<
  | { type: "delete"; path: string; originalContent: string }
  | { type: "modify"; path: string; originalContent: string }
> = [];

async function rollback(repoRoot: string) {
  console.error("\nRolling back changes...");

  for (const op of operations.reverse()) {
    try {
      await writeFile(op.path, op.originalContent, "utf-8");
      console.log(`  ✓ Restored ${path.relative(repoRoot, op.path)}`);
    } catch (err) {
      console.error(`  ✗ Failed to restore ${op.path}:`, err);
    }
  }
}

async function recordDeleteOperation(filePath: string, originalContent: string) {
  operations.push({ type: "delete", path: filePath, originalContent });
}

async function recordModifyOperation(filePath: string, originalContent: string) {
  operations.push({ type: "modify", path: filePath, originalContent });
}

function generateVariantsKeysContent(variantKeys: string[]): string {
  return (
    `export const variantKeys = ${JSON.stringify(variantKeys)} as const;\n` +
    `export type VariantKey = (typeof variantKeys)[number];\n`
  );
}

function generateVariantsManifestContent(variantKeys: string[]): string {
  const importLines = variantKeys
    .map(
      (key) =>
        `  "${key}": () => import("./variants/${key}.json", { with: { type: "json" } })`,
    )
    .join(",\n");

  return (
    `import type { VariantKey } from "./variants-keys";\n` +
    `export { variantKeys, type VariantKey } from "./variants-keys";\n\n` +
    `export const loadVariantJson: Record<VariantKey, () => Promise<{ default: unknown }>> = {\n` +
    `${importLines}\n` +
    `};\n`
  );
}

function printUsage() {
  console.error("Usage:");
  console.error("  npm run variant:remove <variant-name> [variant-name...]");
  console.error("  npm run variant:remove except <variant-name> [variant-name...]");
  console.error("");
  console.error("Options:");
  console.error("  except    Remove all variants EXCEPT the specified ones");
  console.error("");
  console.error("Examples:");
  console.error("  npm run variant:remove v1-a v1-b        # Remove v1-a and v1-b");
  console.error("  npm run variant:remove except default   # Remove all except default");
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printUsage();
    process.exit(1);
  }

  // Check for "except" keyword (no dashes to avoid npm flag parsing issues)
  const exceptMode = args[0] === "except";
  const variantNames = exceptMode ? args.slice(1) : args;

  if (variantNames.length === 0) {
    console.error("Error: No variant names provided");
    printUsage();
    process.exit(1);
  }

  if (exceptMode) {
    console.log("Mode: Remove all EXCEPT specified variants");
    console.log(`Keeping: ${variantNames.join(", ")}\n`);
  }

  // Validate variant name format
  const VARIANT_NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  for (const variantName of variantNames) {
    if (!VARIANT_NAME_PATTERN.test(variantName)) {
      console.error(`Invalid variant name: "${variantName}"`);
      console.error("Variant names must:");
      console.error("  - Use only lowercase letters, numbers, and hyphens");
      console.error("  - Not start or end with a hyphen");
      console.error("  - Not contain spaces or special characters");
      console.error(
        'Examples: "spring", "summer", "v1-a", "v2-b", "variant-01"',
      );
      process.exit(1);
    }
  }

  const repoRoot = process.cwd();
  const variantsDir = path.join(repoRoot, "src", "contents", "variants");

  // Get all existing variants
  const entries = await readdir(variantsDir, { withFileTypes: true });
  const existingVariants = entries
    .filter((e) => e.isFile() && e.name.endsWith(".json"))
    .map((e) => e.name.replace(".json", ""));

  // Check that all specified variants exist
  const missingVariants = variantNames.filter(
    (name) => !existingVariants.includes(name),
  );
  if (missingVariants.length > 0) {
    console.error("The following variants do not exist:");
    for (const name of missingVariants) {
      console.error(`  - ${name}`);
    }
    process.exit(1);
  }

  // Determine which variants to remove based on mode
  let variantsToRemove: string[];
  let remainingVariants: string[];

  if (exceptMode) {
    // Remove all variants EXCEPT the specified ones
    variantsToRemove = existingVariants.filter(
      (name) => !variantNames.includes(name),
    );
    remainingVariants = variantNames;
  } else {
    // Remove the specified variants
    variantsToRemove = variantNames;
    remainingVariants = existingVariants.filter(
      (name) => !variantNames.includes(name),
    );
  }

  // Check that at least one variant will remain after deletion
  if (remainingVariants.length === 0) {
    console.error("Cannot remove all variants!");
    console.error("At least one variant must remain.");
    console.error(`Existing variants: ${existingVariants.join(", ")}`);
    console.error(`Attempting to remove: ${variantsToRemove.join(", ")}`);
    process.exit(1);
  }

  // Check that there's something to remove
  if (variantsToRemove.length === 0) {
    console.log("No variants to remove.");
    process.exit(0);
  }

  // Remove duplicates from input
  const uniqueVariantNames = [...new Set(variantsToRemove)];

  console.log(`Will remove ${uniqueVariantNames.length} variant(s): ${uniqueVariantNames.join(", ")}`);
  console.log(`Will keep ${remainingVariants.length} variant(s): ${remainingVariants.join(", ")}\n`);

  // Delete each variant file
  for (const variantName of uniqueVariantNames) {
    const variantFile = path.join(variantsDir, `${variantName}.json`);

    // Read content for rollback
    const originalContent = await readFile(variantFile, "utf-8");
    await recordDeleteOperation(variantFile, originalContent);

    // Delete the file
    await unlink(variantFile);
    console.log(`✓ Removed ${variantName}.json`);
  }

  // Update manifest files directly
  console.log("\nUpdating manifest files...");

  const sortedRemainingVariants = remainingVariants.sort((a, b) =>
    a.localeCompare(b),
  );

  const variantsKeysPath = path.join(repoRoot, "src", "contents", "variants-keys.ts");
  const variantsManifestPath = path.join(repoRoot, "src", "contents", "variants-manifest.ts");

  // Record original content for rollback
  const originalKeysContent = await readFile(variantsKeysPath, "utf-8");
  const originalManifestContent = await readFile(variantsManifestPath, "utf-8");
  await recordModifyOperation(variantsKeysPath, originalKeysContent);
  await recordModifyOperation(variantsManifestPath, originalManifestContent);

  // Write updated files
  await writeFile(
    variantsKeysPath,
    generateVariantsKeysContent(sortedRemainingVariants),
    "utf-8",
  );
  console.log("✓ Updated variants-keys.ts");

  await writeFile(
    variantsManifestPath,
    generateVariantsManifestContent(sortedRemainingVariants),
    "utf-8",
  );
  console.log("✓ Updated variants-manifest.ts");

  console.log(`\n✅ Successfully removed ${uniqueVariantNames.length} variant(s)!`);
  for (const variantName of uniqueVariantNames) {
    console.log(`   - Removed: src/contents/variants/${variantName}.json`);
  }
  console.log(`   - Updated: src/contents/variants-keys.ts`);
  console.log(`   - Updated: src/contents/variants-manifest.ts`);
}

main().catch(async (err) => {
  console.error("\n❌ Error:", err.message || err);

  // Perform rollback if we have any operations recorded
  if (operations.length > 0) {
    try {
      await rollback(process.cwd());
    } catch (rollbackErr) {
      console.error("Rollback also failed:", rollbackErr);
    }
  }

  process.exit(1);
});

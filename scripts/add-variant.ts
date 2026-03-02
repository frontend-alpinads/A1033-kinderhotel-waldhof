import { readFile, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";

// Track operations for rollback capability (module scope)
const operations: Array<{
  type: "create" | "modify";
  path: string;
  originalContent?: string;
}> = [];

async function rollback(repoRoot: string) {
  console.error("\nRolling back changes...");
  const { unlink } = await import("node:fs/promises");

  for (const op of operations.reverse()) {
    try {
      if (op.type === "create") {
        await unlink(op.path);
        console.log(`  ✓ Removed ${path.relative(repoRoot, op.path)}`);
      } else if (op.type === "modify" && op.originalContent) {
        await writeFile(op.path, op.originalContent, "utf-8");
        console.log(`  ✓ Restored ${path.relative(repoRoot, op.path)}`);
      }
    } catch (err) {
      console.error(`  ✗ Failed to rollback ${op.path}:`, err);
    }
  }
}

async function recordOperation(
  type: "create" | "modify",
  filePath: string,
  originalContent?: string,
) {
  operations.push({ type, path: filePath, originalContent });
}

async function main() {
  const variantName = process.argv[2];

  if (!variantName) {
    console.error("Usage: tsx scripts/add-variant.ts <variant-name>");
    console.error('Example: tsx scripts/add-variant.ts "v2-b"');
    process.exit(1);
  }

  // Validate variant name format - flexible but follows file naming best practices
  const VARIANT_NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
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

  const repoRoot = process.cwd();
  const variantsDir = path.join(repoRoot, "src", "contents", "variants");
  const newVariantFile = path.join(variantsDir, `${variantName}.json`);
  const variantsKeysFile = path.join(
    repoRoot,
    "src",
    "contents",
    "variants-keys.ts",
  );
  const variantsManifestFile = path.join(
    repoRoot,
    "src",
    "contents",
    "variants-manifest.ts",
  );

  // Check if variant already exists
  try {
    await readFile(newVariantFile);
    console.error(`Variant "${variantName}" already exists!`);
    process.exit(1);
  } catch {
    // File doesn't exist, which is what we want
  }

  // Find the most recently modified variant file to use as template
  const { readdir, stat } = await import("node:fs/promises");
  const entries = await readdir(variantsDir, { withFileTypes: true });
  const jsonFiles = entries.filter(
    (e) => e.isFile() && e.name.endsWith(".json"),
  );

  if (jsonFiles.length === 0) {
    console.error("No existing variant files found to use as template!");
    process.exit(1);
  }

  // Get modification times and sort by most recent
  const filesWithStats = await Promise.all(
    jsonFiles.map(async (file) => {
      const filePath = path.join(variantsDir, file.name);
      const stats = await stat(filePath);
      return { name: file.name, mtime: stats.mtime };
    }),
  );

  filesWithStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  const templateFileName = filesWithStats[0].name;
  const templateFile = path.join(variantsDir, templateFileName);

  console.log(
    `Using ${templateFileName} as template (most recently modified)`,
  );

  // Copy template to create new variant file
  await copyFile(templateFile, newVariantFile);
  await recordOperation("create", newVariantFile);
  console.log(`✓ Created ${variantName}.json from template ${templateFileName}`);

  // Regenerate manifest files using the existing generate-variants script
  // This is more reliable than string manipulation and ensures consistency
  console.log("\nRegenerating manifest files...");
  const { spawn } = await import("node:child_process");

  try {
    const generateProcess = spawn("tsx", ["scripts/generate-variants.ts"], {
      cwd: repoRoot,
      stdio: "inherit",
    });

    await new Promise<void>((resolve, reject) => {
      generateProcess.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(
            new Error(`generate-variants.ts exited with code ${code}`),
          );
        }
      });
      generateProcess.on("error", reject);
    });

    console.log("✓ Updated variants-keys.ts");
    console.log("✓ Updated variants-manifest.ts");
  } catch (error) {
    console.error("Failed to regenerate manifest files");
    throw error;
  }

  console.log(`\n✅ Successfully created variant "${variantName}"!`);
  console.log(`   - Created: src/contents/variants/${variantName}.json`);
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

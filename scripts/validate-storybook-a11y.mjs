import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const storyRoot = path.join(repoRoot, "apps/storybook/src");

const storyFiles = fs
  .readdirSync(storyRoot)
  .filter((file) => file.endsWith(".stories.ts"))
  .sort();

const missingCoverage = [];

for (const file of storyFiles) {
  const absolutePath = path.join(storyRoot, file);
  const source = fs.readFileSync(absolutePath, "utf8");
  const hasA11yErrorCoverage = /a11y\s*:\s*\{\s*test\s*:\s*"error"/s.test(source);

  if (!hasA11yErrorCoverage) {
    missingCoverage.push(path.relative(repoRoot, absolutePath));
  }
}

if (missingCoverage.length > 0) {
  console.error("Storybook browser accessibility coverage is incomplete.");
  for (const file of missingCoverage) {
    console.error(`- ${file}: add parameters.a11y.test = "error"`);
  }
  process.exit(1);
}

console.log(
  `Storybook accessibility coverage validation passed (${storyFiles.length} story files).`,
);

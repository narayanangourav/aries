import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const SOURCE_EXTENSIONS = new Set([".css", ".ts", ".tsx"]);
const FORBIDDEN_PATTERNS = [
  { label: "console.log", pattern: /console\.log/u },
  { label: "inline style", pattern: /\sstyle\s*=/u },
  { label: "localStorage", pattern: /\blocalStorage\b/u },
  { label: "unknown type", pattern: /\bunknown\b/u },
];

const findSourceFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return findSourceFiles(path);
      return SOURCE_EXTENSIONS.has(extname(entry.name)) ? [path] : [];
    }),
  );
  return files.flat();
};

const files = await findSourceFiles("src");
const failures = [];

for (const file of files) {
  const content = await readFile(file, "utf8");
  const lines = content.split(/\r?\n/u);

  if (extname(file) === ".tsx" && lines.length - 1 > 200) {
    failures.push(`${file}: exceeds 200 lines`);
  }

  for (const { label, pattern } of FORBIDDEN_PATTERNS) {
    if (pattern.test(content)) failures.push(`${file}: contains ${label}`);
  }

  if (extname(file) === ".css") {
    const selectorContent = content.replace(/url\([^)]*\)/gu, "");
    const classNames = [
      ...selectorContent.matchAll(/\.([a-z][a-z0-9-]*)/gu),
    ].map((match) => match[1]);
    const invalidClass = classNames.find(
      (className) => !className.startsWith("app-"),
    );
    if (invalidClass) {
      failures.push(`${file}: class .${invalidClass} is not app-namespaced`);
    }
  }
}

if (failures.length) {
  process.stderr.write(`${failures.join("\n")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`Lint checks passed for ${files.length} files.\n`);
}

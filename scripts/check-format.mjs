import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const SOURCE_EXTENSIONS = new Set([".css", ".ts", ".tsx"]);

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
  if (!content.endsWith("\n")) failures.push(`${file}: missing final newline`);
  if (/\t/u.test(content)) failures.push(`${file}: contains tab indentation`);
  if (/[ \t]+$/mu.test(content)) failures.push(`${file}: trailing whitespace`);
}

if (failures.length) {
  process.stderr.write(`${failures.join("\n")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`Formatting checks passed for ${files.length} files.\n`);
}


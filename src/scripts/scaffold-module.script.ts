import {mkdirSync, writeFileSync, existsSync} from "fs";
import path from "path";

// Example usage -> bun run src/scripts/scaffold-module.script.ts auth
// auth is the name of the module

const name = process.argv[2];

if (!name) {
  console.error("❌ Please provide a module name");
  process.exit(1);
}

const baseDir = path.join(process.cwd(), "src", "modules");
const folder = path.join(baseDir, name);

if (existsSync(folder)) {
  console.error(`⚠️ Module '${name}' already exists.`);
  process.exit(1);
}

mkdirSync(folder, {recursive: true});

const files = [
  `${name}.controller.ts`,
  `${name}.routes.ts`,
  `${name}.model.ts`,
  `${name}.service.ts`,
  `${name}.interface.ts`,
  `${name}.schema.ts`,
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const boilerplate: Record<string, string> = {
  controller: `export class ${cap(name)}Controller {}`,
  routes: `import { Router } from "express";\n\nconst router = Router();\n\nexport default router;`,
  model: `export interface ${cap(name)} {}`,
  service: `export class ${cap(name)}Service {}`,
  interface: `export interface ${cap(name)}Interface {}`,
  schema: `import { z } from "zod";\n\nexport const ${name}Schema = z.object({});`,
};

files.forEach((file) => {
  const type = file.split(".")[1];
  if (!type) {
    return;
  }

  writeFileSync(path.join(folder, file), boilerplate[type] || "");
});

console.log(`✅ Created '${name}' module in src/modules/${name}`);

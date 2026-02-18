import fs from "fs";
import path from "path";

export function getSiteRoutes(): string[] {
  const appDir = path.resolve(process.cwd(), "src/app/(frontend)");
  const routes: string[] = [];

  function scan(dir: string, prefix: string) {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const segment = entry.name;
        // Strip route groups like (marketing)
        if (segment.startsWith("(") && segment.endsWith(")")) {
          scan(path.join(dir, segment), prefix);
        } else {
          scan(path.join(dir, segment), `${prefix}/${segment}`);
        }
      } else if (entry.name === "page.tsx" || entry.name === "page.ts") {
        routes.push(prefix || "/");
      }
    }
  }

  scan(appDir, "");
  return routes.sort();
}

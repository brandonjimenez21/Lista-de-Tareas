import fs from "fs";
import { routesNames } from "./src/routes/router.meta.js";

const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

function buildSitemap() {
  const urls = routesNames.sort().map((name) => {
    return `
      <url>
        <loc>${BASE_URL}/#/${name}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
    `;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.join("")}
  </urlset>`;
}

fs.writeFileSync("public/sitemap.xml", buildSitemap(), "utf8");

console.log(`✅ Sitemap generado en /public/sitemap.xml con dominio: ${BASE_URL}`);

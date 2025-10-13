export function renderSitemap() {
  fetch("/sitemap.xml")
    .then((res) => res.text())
    .then((xmlStr) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlStr, "application/xml");
      const urls = [...xml.querySelectorAll("url loc")];

      const list = document.getElementById("sitemap-list");
      list.innerHTML = "";

      urls.forEach((loc) => {
        const li = document.createElement("li");
        const linkText = loc.textContent.split("#")[1];
        li.innerHTML = `<a href="${loc.textContent}" target="_blank">${linkText}</a>`;
        list.appendChild(li);
      });
    })
    .catch((err) => {
      console.error("Error cargando sitemap:", err);
      document.getElementById("sitemap-list").innerHTML =
        "<li style='color:red'>Error al cargar el sitemap</li>";
    });
}

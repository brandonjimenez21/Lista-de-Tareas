/**
 * Renderiza el layout principal y coloca el contenido de la vista dentro de <main id="content">
 */
import { logout } from "../utils/auth.js";
import { Icons } from "../utils/icons.js";
/**
 * Render the main application layout.
 *
 * This layout:
 *  - Displays a header with the app logo and navigation links.
 *  - Provides links for "Home", "Tasks", and "+ New Task".
 *  - Includes a logout button with an inline SVG icon that calls {@link logout}.
 *  - Wraps the main view content inside <main id="content">.
 *  - Adds a #modal-root container for rendering modals.
 *  - Displays a footer with app copyright.
 *
 * @function
 * @param {string} innerHtml - The HTML content of the current view to inject inside the <main> section.
 * @returns {string} The complete HTML string for the layout including header, main content, and footer.
 *
 * @example
 * // Render a task list view inside the main layout
 * const html = renderLayout("<h2>My Tasks</h2><ul><li>Task 1</li></ul>");
 * document.body.innerHTML = html;
 */

export function renderLayout(innerHtml) {
  return `
    <div class="layout">
      <header class="header">
        <div class="logo-container">
          <img src="icon.png" alt="Taskio ilustración" class="logo">

          <h1 class="logo-text">Taskio</h1>
        </div>

        <!-- Botón Hamburguesa -->
        <button id="menu-toggle" class="menu-toggle" aria-label="Abrir menú">
          ☰
        </button>

        <!-- Menú -->
        <nav id="nav-menu" class="nav-menu">
          <a href="#/home" class="nav-link">${Icons.home}Inicio</a>
          <a href="#/taskList" class="nav-link">${Icons.tasks}Tareas</a>
          <a href="#/profile" class="nav-link">${Icons.profile}Perfil</a>
          <a href="#/about" class="nav-link">${Icons.about} Sobre Nosotros</a>
          <a href="javascript:void(0)"
            id="logout-btn"
            class="logout-icon nav-link"
            title="Cerrar sesión"
            onclick="logout()">
            ${Icons.logout} Cerrar Sesión
          </a>
        </nav>
      </header>

      <main id="content" class="main-content">
        ${innerHtml} <!-- Aquí entra el HTML de la vista -->
      </main>

      <div id="modal-root"></div>

      <footer>
        © 2025 - Todos los derechos reservados
        <a href="#/sitemap">Mapa del sitio</a>
      </footer>
    </div>
  `;
}

import { renderLayout, renderAuthLayout } from "../layouts";
import { renderTaskList } from "../components/taskList";
import { renderRegister } from "../components/register";
import { renderLogin } from "../components/login";
import { openModal, closeModal } from "../components/modal";
import { setupTaskForm } from "../components/taskNew.js";
import { createTask, getTasks, updateTask } from "../api/tasks.js";
import { resetPassword } from "../api/users";
import { initRestablePassword } from "../components/resetPasswordForm";
import { showToast } from "../utils/toasts.js";
import { checkAuth, requireAuth } from "../utils/auth.js";
import { layoutsActions } from "../components/layoutsActions";
import { renderProfile } from "../components/profile";
import { initHome } from "../components/home";
import { renderSitemap } from "../components/sitemap";

const app = document.getElementById("app");

/**
 * @typedef {Object} Route
 * @property {string} file - The HTML file to load for this route.
 * @property {Function|null} init - Initialization function for the view (optional).
 * @property {Function} layout - Layout renderer function (wraps the view HTML).
 */

/**
 * Build a safe URL for fetching view fragments inside Vite (dev and build).
 *
 * @param {string} name - The name of the view (without extension).
 * @returns {URL} The resolved URL for the view HTML file.
 *
 * @example
 * const url = viewURL("login");
 * // => URL object pointing to ../views/login.html
 */

const viewURL = (name) => new URL(`../views/${name}.html`, import.meta.url);

/**
 * Map of available application routes.
 * Each route defines which HTML file to load, which layout to use, and an optional initializer.
 *
 * @type {Object.<string, Route>}
 */

export const routes = {
  home: {
    file: "home.html",
    init: initHome,
    layout: renderLayout,
  },
  about: {
    file: "about.html",
    init: initAbout,
    layout: renderLayout,
  },
  taskList: {
    file: "taskList.html",
    init: initBoard,
    layout: renderLayout,
  },
  login: {
    file: "login.html",
    init: renderLogin,
    layout: renderAuthLayout,
  },
  register: {
    file: "register.html",
    init: renderRegister,
    layout: renderAuthLayout,
  },
  "reset-password": {
    file: "reset-password.html",
    init: initRestablePassword,
    layout: renderAuthLayout,
  },
  profile: {
    file: "profile.html",
    init: renderProfile,
    layout: renderLayout,
  },
  sitemap: {
    file: "sitemap.html",
    init: renderSitemap,
    layout: renderLayout,
  },
};

/**
 * Open the "new task" modal.
 *
 * This function:
 *  - Fetches the HTML fragment for the new task form.
 *  - Renders it inside a modal via {@link openModal}.
 *  - Sets up cancel and submit handlers.
 *
 * @async
 * @returns {Promise<void>}
 */

export async function openTaskNewModal(task = null) {
  // 1) Traer el HTML del formulario
  const res = await fetch(new URL(`../views/taskNew.html`, import.meta.url));
  const html = await res.text();

  openModal(html);

  // 2) Referencias al DOM después de inyectar el modal
  const form = document.getElementById("task-form");
  const cancelBtn = document.getElementById("cancel-btn");
  const titleH2 = document.getElementById("title_h2");
  const buttonTask = document.getElementById("button-task");

  // 3) Configurar fecha mínima
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("date")?.setAttribute("min", today);

  // 4) Si hay tarea → edición
  if (task) {
    // Cambiar textos
    titleH2.textContent = "Actualizar Tarea";
    buttonTask.textContent = "Actualizar Tarea";

    // Rellenar datos
    form.querySelector("#title").value = task.title;
    form.querySelector("#detail").value = task.detail || "";
    const dueDate = new Date(task.dueDate);
    form.querySelector("#date").value = dueDate.toISOString().split("T")[0];
    form.querySelector("#time").value = dueDate.toTimeString().slice(0, 5);
    form.querySelector("#status").value = task.status;
  } else {
    // Modo crear
    titleH2.textContent = "Crear Nueva Tarea";
    buttonTask.textContent = "Crear Tarea";
  }

  // 5) Cancelar
  if (cancelBtn) {
    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeModal();
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const taskData = {
      title: fd.get("title"),
      detail: fd.get("detail"),
      date: fd.get("date"),
      time: fd.get("time"),
      status: fd.get("status"),
      dueDate: new Date(`${fd.get("date")}T${fd.get("time")}`),
    };

    try {
      const buttonTaskText = buttonTask.textContent;
      buttonTask.disabled = true;
      buttonTask.innerHTML = `<span class="spinner"></span> ${buttonTaskText === "Crear Tarea" ? "Creando..." : "Actualizando..."}`;
      if (task) {
        // 👉 Edición
        await updateTask(task.id, taskData);
        showToast("Tarea actualizada exitosamente", "success");
      } else {
        // 👉 Creación
        await createTask(taskData);
        showToast("Tarea creada exitosamente", "success");
      }
      buttonTask.disabled = false;
      buttonTask.innerHTML = buttonTaskText;

      initBoard();
      closeModal();
    } catch {
      showToast("Error al guardar la tarea", "error");
    }
  });
}
/**
 * Load a given view into the #app container.
 *
 * @async
 * @param {string} name - Route name (must exist in {@link routes}).
 * @returns {Promise<void>}
 * @throws {Error} If the route or view file cannot be found.
 */

export async function loadView(name) {
  const route = routes[name];
  const app = document.getElementById("app");

  if (!route) {
    throw new Error(`Route not found: ${name}`);
  }

  try {
    // view HTML
    const res = await fetch(viewURL(name));
    if (!res.ok) throw new Error(`Failed to load view: ${name}`);
    const html = await res.text();

    // Render with layout
    app.innerHTML = route.layout ? await route.layout(html) : html;

    // Run initializer
    if (typeof route.init === "function") {
      layoutsActions()

      try {
        route.init();
      } catch (error) {
        console.error(`Error initializing route ${name}:`, error);
      }
    }
  } catch (err) {
    console.error(err);
    app.innerHTML = `
      <p style="color:#ffb4b4">Error loading the view "${name}"</p>
    `;
  }
}

export function initAbout() {
  // Verificar autenticación antes de cargar
  // if (!requireAuth()) {
  //   console.log("User not authenticated, redirecting to login");
  //   return;
  // }

  console.log("About page initialized");
  // lógica específica para la página "Sobre nosotros"
}

export async function initBoard() {
  const tasks = await getTasks();

  renderTaskList(tasks);

}

/**
 * Initialize the hash-based router.
 * Attaches a hashchange listener and performs the first render.
 *
 * @function
 */
export function initRouter() {
  window.addEventListener("hashchange", handleRoute);
  handleRoute(); // first render
}

/**
 * Handle the current route based on location.hash.
 * Enforces authentication rules (redirects based on token presence).
 *
 * @private
 */
function handleRoute() {
  const isAuthenticated = checkAuth();

  const hash = location.hash.startsWith("#/") ? location.hash.slice(2) : "";
  const [routePath] = hash.split("?"); // 👈 separa ruta y query
  const path = routePath || "login";

  // Ya no verificamos localStorage, porque usamos cookies
  const route = routes[path] ? path : "login";

  loadView(route).catch((err) => {
    console.error(err);
    app.innerHTML = `<p style="color:#ffb4b4">Error loading the view.</p>`;
  });
}
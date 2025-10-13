import { openTaskNewModal } from "../routes/routes";

export function layoutsActions() {
  // Button inside the task list view
  const btn = document.getElementById("btn-new-task");
  if (btn)
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openTaskNewModal();
    });

  // Header link "+ New Task"
  const headerBtn = document.querySelector("a.btn-new-task");
  if (headerBtn)
    headerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openTaskNewModal();
    });

  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }
}

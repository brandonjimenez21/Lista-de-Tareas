import { updateTask } from "../api/tasks.js";
import { TaskCard } from "./taskCard.js";

/**
 * @typedef {Object} Task
 * @property {string} id - Unique identifier for the task.
 * @property {string} title - Task title.
 * @property {string} [detail] - Optional description of the task.
 * @property {"todo"|"in-progress"|"done"} status - Current task status.
 * @property {string} dueDate - Due date as a parsable string (ISO or Date-compatible).
 */

/**
 * Render a list of tasks into their respective columns (todo, in-progress, done).
 *
 * This function:
 *  - Initializes the task creation modal and handles form submission.
 *  - Clears and re-renders the columns each time tasks are updated.
 *  - Creates draggable task cards using {@link TaskCard}.
 *  - Implements drag-and-drop functionality to update task status across columns.
 *
 * @function
 * @param {Task[]} tasks - Array of task objects to be rendered.
 * @returns {void} Updates the DOM directly.
 *
 * @example
 * const tasks = [
 *   { id: "1", title: "Setup project", status: "todo", dueDate: "2025-09-20" },
 *   { id: "2", title: "Write docs", detail: "Use JSDoc", status: "in-progress", dueDate: "2025-09-21" }
 * ];
 *
 * renderTaskList(tasks);
 */

export function renderTaskList(tasks) {
  const taskModal = document.getElementById("taskModal");
  const taskForm = document.getElementById("taskForm");

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("taskTitle").value;
    const detail = document.getElementById("taskDetail").value;
    const status = document.getElementById("taskStatus").value;

    // Create a new task
    const task = document.createElement("div");
    task.className = "task";
    task.textContent = title;

    document.getElementById(status).appendChild(task);

    // Reset and close modal
    taskForm.reset();
    taskModal.classList.add("hidden");
  });

  const columns = {
    todo: document.getElementById("todo"),
    "in-progress": document.getElementById("in-progress"),
    done: document.getElementById("done"),
  };

  // Render task cards
  function render() {
    Object.values(columns).forEach((col) => (col.innerHTML = "")); // clear all columns
    
    tasks.forEach((task) => {
      const card = TaskCard(task);
      columns[task.status].appendChild(card);

      // Reattach drag event
      card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", task.id);
      });
    });
  }

  // Enable drag & drop across columns
  Object.entries(columns).forEach(([status, col]) => {
    const parent = col.parentElement; // column wrapper

    parent.addEventListener("dragover", (e) => {
      e.preventDefault();
      col.classList.add("highlight");
    });

    parent.addEventListener("dragleave", () => {
      col.classList.remove("highlight");
    });

    parent.addEventListener("drop", async(e) => {
      e.preventDefault();
      col.classList.remove("highlight");

      const id = e.dataTransfer.getData("text/plain");
      const task = tasks.find((t) => t.id == id);
      if (task) {
        task.status = status;
        render();
        await updateTask(id,  task );
  
      }
    });
  });
  render();
}

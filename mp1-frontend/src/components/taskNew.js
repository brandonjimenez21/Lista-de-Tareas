import { createTask } from "../api/tasks.js";
import { initBoard } from "../routes/routes.js";
import { showToast } from "../utils/toasts.js";

/**
 * @typedef {Object} TaskData
 * @property {string} title - The title of the task (1–50 characters).
 * @property {string} detail - The detailed description of the task (up to 500 characters).
 * @property {string} date - The due date in YYYY-MM-DD format.
 * @property {string} time - The due time in HH:mm format.
 * @property {"todo"|"in-progress"|"done"} status - The current status of the task.
 * @property {Date} dueDate - A Date object combining date and time.
 */

/**
 * Initialize the task creation form.
 *
 * This function:
 *  - Sets up real-time validation and character counters for title and detail inputs.
 *  - Handles form submission:
 *    - Collects form data and builds a {@link TaskData} object.
 *    - Calls {@link createTask} to save the task in the backend.
 *    - Displays success or error messages using {@link showToast}.
 *    - Reloads the page after a successful task creation.
 *  - Handles the cancel button to close the modal.
 *
 * @function
 * @returns {void} Updates the DOM and interacts with backend APIs.
 *
 * @example
 * // HTML:
 * <form id="task-form">
 *   <input id="title" name="title" maxlength="50" required />
 *   <span id="title-count"></span>
 *   <textarea id="detail" name="detail" maxlength="500"></textarea>
 *   <span id="detail-count"></span>
 *   <input id="date" type="date" name="date" required />
 *   <input id="time" type="time" name="time" required />
 *   <select id="status" name="status">
 *     <option value="todo">To do</option>
 *     <option value="in-progress">In progress</option>
 *     <option value="done">Done</option>
 *   </select>
 *   <button type="submit">Create Task</button>
 *   <button type="button" id="cancel-btn">Cancel</button>
 * </form>
 * <div id="modal-task" class="hidden"></div>
 *
 * // JS:
 * setupTaskForm();
 */

export function setupTaskForm() {
  const form = document.getElementById("task-form");
  const titleInput = document.getElementById("title");
  const detailInput = document.getElementById("detail");
  const titleCount = document.getElementById("title-count");
  const detailCount = document.getElementById("detail-count");
  const cancelBtn = document.getElementById("cancel-btn");
  const buttonTask = document.getElementById("button-task");
  const taskModal = document.getElementById("modal-task");

  // title validation real time
  titleInput.addEventListener("input", () => {
    validateTitle(titleInput);
    titleCount.textContent = `${titleInput.value.length}/50`;
  });

  // real-time detail character count
  detailInput.addEventListener("input", () => {
    detailCount.textContent = `${detailInput.value.length}/500`;
  });

  // form submission handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const taskData = {
      title: formData.get("title"),
      detail: formData.get("detail"),
      date: formData.get("date"),
      time: formData.get("time"),
      status: formData.get("status"),
      dueDate: new Date(`${formData.get("date")}T${formData.get("time")}`),
    };

    const originalText = buttonTask.textContent;
    buttonTask.disabled = true;
    buttonTask.innerHTML = `<span class="spinner"></span> ${originalText === "Crear Tarea" ? "Creando..." : "Actualizando..."}`;

    try {
      await createTask(taskData);
      console.log("Refrescando el tablero...");
      showToast("Tarea creada exitosamente", "success");
      location.reload();
      

    } catch (error) {
      showToast("Error al crear la tarea", "error");
    } finally {
      buttonTask.disabled = false;
      buttonTask.innerHTML = originalText;
    }
  });

  // cancel button handler
  cancelBtn.addEventListener("click", () => {
    taskModal.classList.add("hidden");
  });

  // Internal validation helper
  function validateTitle(input) {
    const isValid = input.value.length > 0 && input.value.length <= 50;
    input.setCustomValidity(
      isValid ? "" : "El título debe tener entre 1 y 50 caracteres"
    );
  }
}

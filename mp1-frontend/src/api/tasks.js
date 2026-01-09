const API = import.meta.env.VITE_API_URL;

/**
 * @typedef {Object} TaskData
 * @property {string} title - The task title.
 * @property {string} [detail] - Optional description of the task.
 * @property {string} date - The due date in YYYY-MM-DD format.
 * @property {string} time - The due time in HH:mm format.
 * @property {"todo"|"in-progress"|"done"} status - The current task status.
 * @property {Date|string} dueDate - The due date as a Date object or ISO string.
 */

/**
 * Fetch all tasks from the API.
 *
 * @async
 * @function
 * @returns {Promise<TaskData[]>} A promise that resolves to an array of task objects.
 * @throws {Error} If the request fails or the response is not OK.
 *
 * @example
 * const tasks = await getTasks();
 * console.log(tasks.length); // → number of tasks
 */
export async function getTasks() {
  const res = await fetch(`${API}/tasks`, {
    method: "GET",
    credentials: "include", // la cookie se manda sola
  });
  if (!res.ok) throw new Error("Error fetching tasks");
  return res.json();
}

/**
 * Create a new task via the API.
 *
 * @async
 * @function
 * @param {TaskData} task - The task object to create.
 * @returns {Promise<TaskData>} A promise that resolves to the created task object.
 * @throws {Error} If the request fails or the response is not OK.
 *
 * @example
 * const newTask = await createTask({
 *   title: "Finish docs",
 *   detail: "Write JSDoc for API",
 *   date: "2025-09-12",
 *   time: "14:00",
 *   status: "todo",
 *   dueDate: new Date("2025-09-12T14:00"),
 * });
 */
export async function createTask(task) {
  const res = await fetch(`${API}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // también aquí
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Error creating task");
  return res.json();
}

export async function updateTask(id, updates) {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Error updating task");
  return res.json();
}

export async function deleteTask(id){
  const res = await fetch(`${API}/tasks/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error delete task");
  return res.json();
}

export async function taskStatistics(){
  const res = await fetch(`${API}/tasks/stats`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error fetching task statistics");
  return res.json();
}
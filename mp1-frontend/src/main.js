import { getTasks } from "./api/tasks.js";
import { renderTaskList } from "./components/taskList.js";
import { initRouter } from "./routes/routes.js";
import './styles/index.css';

/**
 * Initialize the application.
 *
 * This function:
 *  - Fetches the list of tasks from the backend using {@link getTasks}.
 *  - Renders the task list in the UI using {@link renderTaskList}.
 *
 * Errors during fetching or rendering are caught and logged to the console.
 *
 * @async
 * @function
 * @returns {Promise<void>} Resolves when initialization is complete.
 *
 * @example
 * // Run the app initialization
 * init();
 */

// Initialize the hash-based router (manages app navigation)
await initRouter();
/**
 * @file routes.js
 * @description Definition of the main REST API routes for users and tasks.
 */


const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/auth");

// importamos validaciones
const { createTaskValidation } = require("../middleware/taskValidation");
const validateRequest = require("../middleware/validateRequest");

const { signup, login, logout, forgotPassword, resetPassword, session, getProfile, updateProfile, deleteProfile } = require("../controllers/userController");

/**
 * @route POST /signup
 * @description Register a new user
 * @access Public
 */
router.post("/signup", signup);

/**
 * @route POST /login
 * @description User login and token generation
 * @access Public
 */
router.post("/login", login);

/**
 * @route POST /logout
 * @description Logout the authenticated user
 * @access Private
 */
router.post("/logout", authMiddleware, logout);

/**
 * @route POST /tasks
 * @description Create a new task
 * @access Private
 */
router.post(
  "/tasks",
  authMiddleware,
  createTaskValidation, // validaciones
  validateRequest,      // chequea errores
  taskController.createTask
);

/**
 * @route GET /tasks/stats
 * @description Get statistics of the user's tasks (by status)
 * @access Private
 */
router.get("/tasks/stats", authMiddleware, taskController.getTaskStats);

/**
 * @route GET /tasks/:id
 * @description Get a task by its ID
 * @access Private
 */
router.get("/tasks/:id", authMiddleware, taskController.getTaskById);

/**
 * @route PUT /tasks/:id
 * @description Update an existing task by ID
 * @access Private
 */
router.put("/tasks/:id", authMiddleware, taskController.updateTask);

/**
 * @route DELETE /tasks/:id
 * @description Delete a task by its ID
 * @access Private
 */
router.delete("/tasks/:id", authMiddleware, taskController.deleteTask);

/**
 * @route GET /tasks
 * @description Get all tasks of the authenticated user
 * @access Private
 */
router.get("/tasks", authMiddleware, taskController.getUserTasks);


/**
 * @route GET /profile
 * @description Get the authenticated user's profile
 * @access Private
 */
router.get("/profile", authMiddleware, getProfile);

/**
 * @route PUT /profile
 * @description Update the authenticated user's profile
 * @access Private
 */
router.put("/profile", authMiddleware, updateProfile);

/**
 * @route DELETE /profile
 * @description Delete the authenticated user's profile
 * @access Private
 */
router.delete("/profile", authMiddleware, deleteProfile);

/**
 * @route POST /forgot-password
 * @description Request a token to reset the password
 * @access Public
 */
router.post("/forgot-password", forgotPassword);

/**
 * @route POST /reset-password/:token
 * @description Reset password using a valid token
 * @access Public
 */
router.post("/reset-password/:token", resetPassword);

/**
 * @route GET /session
 * @description Check the authenticated user's session
 * @access Public
 */
router.get("/session", session);

module.exports = router;
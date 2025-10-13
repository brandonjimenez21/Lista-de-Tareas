const Task = require("../models/taskModel");
const mongoose = require("mongoose");

/**
 * Create a new task for the authenticated user.
 *
 * @async
 * @function createTask
 * @param {Object} req - HTTP request object.
 * @param {Object} req.body - Task data sent in the request body.
 * @param {string} req.body.title - Task title (required).
 * @param {string} [req.body.detail] - Task description (optional).
 * @param {string} req.body.date - Due date in YYYY-MM-DD format.
 * @param {string} req.body.time - Due time in HH:mm format.
 * @param {string} req.body.status - Task status ("todo", "in-progress", "done").
 * @param {Object} res - HTTP response object.
 * @param {Function} next - Middleware for error handling.
 * @returns {Promise<void>} Response with the created task.
 */

exports.createTask = async (req, res, next) => {
  try {
    const { title, detail, date, time, status } = req.body;

    // Validaciones de negocio
    if (!title || !date || !time || !status) {
      const error = new Error("Los campos title, dueDate y status son obligatorios");
      error.statusCode = 400;
      throw error;
    }

    const dueDate = new Date(`${date}T${time}`);

    if (dueDate < new Date()) {
      const error = new Error("La fecha de vencimiento debe ser futura");
      error.statusCode = 400;
      throw error;
    }

    const newTask = new Task({
      userId: req.user.userId,
      title,
      detail,
      date,
      time,
      dueDate, // se guarda redundante para consultas fáciles
      status
    });

    await newTask.save();

    return res.status(201).json({
      message: "Tarea creada con éxito",
      task: newTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve all tasks of the authenticated user with optional filters.
 *
 * @async
 * @function getUserTasks
 * @param {Object} req - HTTP request object.
 * @param {Object} req.query - Optional query parameters for filtering.
 * @param {string} [req.query.status] - Filter by task status.
 * @param {string} [req.query.fromDate] - Filter tasks from a specific date.
 * @param {string} [req.query.toDate] - Filter tasks up to a specific date.
 * @param {string} [req.query.order] - Order of results ("asc" or "desc").
 * @param {string} [req.query.title] - Search by partial match in the title.
 * @param {Object} res - HTTP response object.
 * @param {Function} next - Middleware for error handling.
 * @returns {Promise<void>} List of filtered tasks.
 */

exports.getUserTasks = async (req, res, next) => {
  try {
    // Filtro base: solo tareas del usuario autenticado
    const filter = { userId: req.user.userId };

    // Extraer filtros de los query params
    const { status, fromDate, toDate, order, title } = req.query;

    if (status) {
      filter.status = status; // ej: ?status=done
    }

    if (fromDate || toDate) {
      filter.dueDate = {};
      if (fromDate) filter.dueDate.$gte = new Date(fromDate);
      if (toDate) filter.dueDate.$lte = new Date(toDate);
    }

    if (title) {
      // Filtro por coincidencia parcial en el título (case-insensitive)
      filter.title = { $regex: title, $options: "i" };
    }

    // Ordenar por dueDate ascendente o descendente según "order"
    const sortOrder = order === "desc" ? -1 : 1;

    const tasks = await Task.find(filter).sort({ dueDate: sortOrder });

    return res.json(tasks);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing task by ID.
 *
 * @async
 * @function updateTask
 * @param {Object} req - HTTP request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.id - ID of the task to update.
 * @param {Object} req.body - Fields of the task to update.
 * @param {string} [req.body.title] - New title of the task.
 * @param {string} [req.body.detail] - New description of the task.
 * @param {string} req.body.date - New due date.
 * @param {string} req.body.time - New due time.
 * @param {string} req.body.status - New status of the task.
 * @param {Object} res - HTTP response object.
 * @param {Function} next - Middleware for error handling.
 * @returns {Promise<void>} Updated task if it exists.
 */

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, detail, date, time, status } = req.body;

    // Validaciones de negocio
    const dueDate = new Date(`${date}T${time}`);

    if (dueDate < new Date()) {
      const error = new Error("La fecha de vencimiento debe ser futura");
      error.statusCode = 400;
      throw error;
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { title, detail, date, time, dueDate, status },
      { new: true, runValidators: true }
    );

    if (!task) {
      const error = new Error("Tarea no encontrada");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({ message: "Tarea actualizada", task });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a task by ID.
 *
 * @async
 * @function deleteTask
 * @param {Object} req - HTTP request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.id - ID of the task to delete.
 * @param {Object} res - HTTP response object.
 * @param {Function} next - Middleware for error handling.
 * @returns {Promise<void>} Confirmation message if the task was deleted.
 */

exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.userId });

    if (!task) {
      const error = new Error("Tarea no encontrada");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({ message: "Tarea eliminada con éxito" });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a task by its ID.
 *
 * @async
 * @function getTaskById
 * @param {Object} req - HTTP request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.id - ID of the task to retrieve.
 * @param {Object} res - HTTP response object.
 * @param {Function} next - Middleware for error handling.
 * @returns {Promise<void>} The task if found.
 */

exports.getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Buscar solo tareas del usuario autenticado
    const task = await Task.findOne({ _id: id, userId: req.user.userId });

    if (!task) {
      const error = new Error("Tarea no encontrada");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

/**
 * Get task statistics for the authenticated user.
 *
 * Groups tasks by `status` and returns the total count per category,
 * along with the overall number of tasks.
 *
 * @async
 * @function getTaskStats
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {Function} next - Middleware for error handling.
 * @returns {Promise<void>} Task statistics with total count and grouped by status.
 *
 * @example
 * {
 *   "total": 5,
 *   "byStatus": [
 *     { "status": "todo", "count": 2 },
 *     { "status": "in-progress", "count": 1 },
 *     { "status": "done", "count": 2 }
 *   ]
 * }
 */

exports.getTaskStats = async (req, res, next) => {
  try {
    // Asegurarnos de usar ObjectId en el pipeline
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const stats = await Task.aggregate([
      { $match: { userId } }, // ahora userId es ObjectId
      {
        $group: {
          // si status no existe, usar 'todo' o 'sin-estado'
          _id: { $ifNull: ["$status", "sin-estado"] },
          count: { $sum: 1 },
        },
      },
      // opcional: ordenar por count desc
      { $sort: { count: -1 } },
    ]);

    const totalTasks = await Task.countDocuments({ userId });

    // Formatear la respuesta (más legible)
    const byStatus = stats.map(s => ({ status: s._id, count: s.count }));

    res.json({
      total: totalTasks,
      byStatus,
    });
  } catch (error) {
    next(error);
  }
};
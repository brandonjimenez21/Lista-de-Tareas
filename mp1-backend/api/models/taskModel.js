
/**
 * @file taskModel.js
 * @description Definition of the Task schema and model in MongoDB using Mongoose.
 */


const mongoose = require("mongoose");

/**
 * Schema for the `Task` collection.
 *
 * Represents a task associated with a user.
 * Includes title, detail, date, time, status, and calculated due date.
 *
 * @typedef {Object} Task
 * @property {mongoose.Schema.Types.ObjectId} userId - Reference to the user who owns the task.
 * @property {string} title - Task title (required, maximum 100 characters).
 * @property {string} [detail] - Optional task detail (maximum 500 characters).
 * @property {string} date - Task date in `YYYY-MM-DD` format.
 * @property {string} time - Task time in `HH:mm` format.
 * @property {Date} dueDate - Full date calculated from `date` + `time` (required).
 * @property {"todo"|"in-progress"|"done"} status - Task status (default `"todo"`).
 * @property {Date} createdAt - Automatic task creation date.
 */


const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Relación con el modelo User
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  detail: {
    type: String,
    trim: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  // Campo calculado a partir de date + time
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    default: "todo"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
// 🔹 convertir _id → id y quitar __v automáticamente
taskSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

/**
 * Mongoose model for the `Task` collection.
 *
 * @type {mongoose.Model<Task>}
 */

module.exports = mongoose.model("Task", taskSchema);

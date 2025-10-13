
/**
 * @file taskValidation.js
 * @description Validation middleware for tasks using express-validator.
 */

const { body } = require("express-validator");

/**
 * Validations for creating a task.
 *
 * Applied rules:
 * - **title**: required, maximum 100 characters.
 * - **detail**: optional, maximum 500 characters.
 * - **date**: required, must be in ISO 8601 format (YYYY-MM-DD).
 * - **time**: required, must be a valid HH:mm format (24-hour).
 * - **status**: optional, can only be `todo`, `in-progress`, or `done`.
 *
 * @constant
 * @type {import("express-validator").ValidationChain[]}
 */


const createTaskValidation = [
  body("title")
    .notEmpty().withMessage("El título es obligatorio")
    .isLength({ max: 100 }).withMessage("El título no puede superar los 100 caracteres"),

  body("detail")
    .optional()
    .isLength({ max: 500 }).withMessage("El detalle no puede superar los 500 caracteres"),

  body("date")
    .notEmpty().withMessage("La fecha es obligatoria")
    .isISO8601().withMessage("La fecha debe estar en formato válido (YYYY-MM-DD)"),

  body("time")
    .notEmpty().withMessage("La hora es obligatoria")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("La hora debe estar en formato HH:mm"),

  body("status")
    .optional()
    .isIn(["todo", "in-progress", "done"])
    .withMessage("El estado debe ser uno de: todo, in-progress, done"),
];

module.exports = { createTaskValidation };
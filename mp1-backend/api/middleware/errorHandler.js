/**
 * @file errorHandler.js
 * @description Centralized middleware for handling errors in the Express application.
 */

/**
 * Middleware for global error handling.
 *
 * - Logs the error to the console.
 * - Handles Mongoose validation errors.
 * - Handles duplicate key errors (code 11000 in MongoDB).
 * - Handles JWT-related errors (invalid or expired token).
 * - Returns a generic 500 error if the type is unrecognized.
 *
 * @function errorHandler
 * @param {Object} err - Error object thrown in the application.
 * @param {string} err.message - Error message.
 * @param {string} [err.name] - Error name (e.g., ValidationError, JsonWebTokenError).
 * @param {number} [err.code] - Error code (e.g., 11000 for duplicate key).
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Function to pass the error to the next middleware if needed.
 * @returns {void} Responds with a JSON describing the error and its corresponding status.
 */

function errorHandler(err, req, res, next) {
    console.error("🔥 ERROR DETECTADO:");
    console.error("Mensaje:", err.message);
    console.error("Nombre:", err.name);
    if (err.code) console.error("Código:", err.code);

    if (res.headersSent) {
        return next(err);
    }

    // Errores de validación de Mongoose
    if (err.name === 'ValidationError') {
        const mensajes = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            message: "Error de validación",
            errors: mensajes
        });
    }

    // Errores de clave duplicada (ej: email único)
    if (err.code && err.code === 11000) {
        return res.status(409).json({
            message: "Error de duplicado",
            field: err.keyValue
        });
    }

    // Token inválido
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Token inválido" });
    }

    // Token expirado
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expirado, por favor inicia sesión nuevamente" });
    }

    // Cualquier otro error (genérico)
    return res.status(err.statusCode || 500).json({
      message: err.message || "Error interno en el servidor, por favor intente nuevamente más tarde",
    });
}

module.exports = errorHandler;
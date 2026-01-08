
/**
 * @file index.js
 * @description Main entry point of the Express application.
 * Sets up middlewares, routes, MongoDB connection, and the HTTP server.
 */

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const routes = require('../api/routes/routes');
const errorHandler = require('../api/middleware/errorHandler');
const limiter = require('../api/middleware/rateLimiter');
const cors = require("cors");
const cookieParser = require('cookie-parser');

const app = express();
dotenv.config();

// para que no sobrescriba SameSite
app.set("trust proxy", 1);


/**
 * List of allowed origins for CORS
 * @constant {string[]}
 */
const allowedOrigins = [
  "https://fullglass.vercel.app",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS not allowed"));
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

/**
 * @route /api
 * @description Main API routes (users, tasks, authentication, etc.)
 */
app.use('/api', routes);

// Rate Limiter Middleware
app.use(limiter);

// Error handling middleware (must be last middleware)
app.use(errorHandler);

// Database
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a la base de datos MongoDB'))
    .catch((err) => console.error('Error al conectar a la base de datos MongoDB:', err));


// Ruta principal
/**
 * @route GET /
 * @description Check that the backend server is running
 * @access Public
 */
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando 🚀');
});

/**
 * @constant {number} PORT - Port on which the server runs
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
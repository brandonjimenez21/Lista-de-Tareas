/**
 * @file rateLimiter.js
 * @description Request rate-limiting middleware to protect the API from abuse.
 */

const rateLimit = require("express-rate-limit");

/**
 * IP-based request rate-limiting middleware.
 *
 * - Allows a maximum of 100 requests every 15 minutes per IP address.
 * - If the limit is exceeded, returns a 429 status with an error message in JSON format.
 *
 * @constant
 * @type {import("express-rate-limit").RateLimit}
 */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  statusCode: 429,
  message: { message: "Too many requests, please try again later." },
});

module.exports = limiter;
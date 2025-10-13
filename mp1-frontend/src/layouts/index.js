/**
 * @file Entry point for layout exports.
 *
 * This module re-exports layout renderers so they can be imported
 * from a single place instead of referencing individual files.
 *
 * @module layouts
 */

export { renderAuthLayout } from "./auth.js";
export { renderLayout } from "./main.js";
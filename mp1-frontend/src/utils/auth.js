/**
 * Log the user out of the application.
 *
 * This function:
 *  - Removes the authentication token from localStorage.
 *  - Redirects the user to the root path (/).
 *
 * @function
 * @returns {void} Does not return a value. Redirects the user to the home page.
 *
 * @example
 * // Trigger logout when clicking a button
 * document.getElementById("logoutBtn").addEventListener("click", logout);
 */

import { session } from "../api/users";
import { showToast } from "./toasts";

export async function logout() {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
      method: "POST",
      credentials: "include", // manda la cookie
    });
    showToast("Sesion cerrada correctamente", "success");
    
    window.location.href = "#/";
  } catch (err) {
    console.error("Error al hacer logout:", err);
    showToast("Error al hacer logout", "error");
  }
}

/**
 * Check if the user is authenticated by verifying the token.
 *
 * @function
 * @returns {boolean} True if user is authenticated, false otherwise.
 */
export function checkAuth() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return false;
  }

  // Verificar si el token ha expirado (opcional, el backend también lo validará)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    if (payload.exp < currentTime) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      return false;
    }
    return true;
  } catch (error) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    return false;
  }
}

/**
 * Get the current user's name from localStorage.
 *
 * @function
 * @returns {string} The user's name or 'Usuario' as default.
 */
export function getUserName() {
  return localStorage.getItem('userName') || 'Usuario';
}

/**
 * Get the authentication token from localStorage.
 *
 * @function
 * @returns {string|null} The authentication token or null if not found.
 */
export function getAuthToken() {
  return localStorage.getItem('authToken');
}

/**
 * Protect routes by checking authentication.
 * Redirects to login if not authenticated.
 *
 * @function
 * @returns {boolean} True if authenticated, false if redirected to login.
 */
export async function requireAuth() {
  const res = await session()
  if (!res.ok) {
    
    window.location.href = '#/login';
    return false;
  }
  return true;
}

window.logout = logout;
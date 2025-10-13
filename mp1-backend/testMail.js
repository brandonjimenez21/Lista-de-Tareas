/**
 * @file testMail.js
 * @description Standalone script to test sending emails using the `sendEmail` utility.
 * Loads environment variables from `.env` and sends a test email to the specified recipient.
 */

require("dotenv").config();
const sendEmail = require("./api/utils/sendEmail");

/**
 * Self-invoking function to send a test email.
 *
 * @async
 * @function
 * @returns {Promise<void>} Logs to the console whether the email was sent successfully or if an error occurred.
 *
 * @example
 * // Run in the terminal:
 * node testMail.js
 */

(async () => {
  try {
    await sendEmail({
      to: "TU_OTRO_CORREO@gmail.com", // destinatario de prueba
      subject: "Prueba MP1",
      text: "Este es un correo de prueba desde Node.js 🚀"
    });
    console.log("Correo enviado con éxito ✅");
  } catch (error) {
    console.error("Error enviando correo ❌", error);
  }
})();

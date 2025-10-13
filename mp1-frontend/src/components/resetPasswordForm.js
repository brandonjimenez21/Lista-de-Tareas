import { resetPassword, resetPasswordWithToken } from "../api/users";
import { showToast } from "../utils/toasts";

export function initRestablePassword() {
  console.log("=== initRestablePassword ejecutándose ===");
  const hash = window.location.hash.slice(2);

  // Separa ruta y query
  const [routePath, queryString] = hash.split("?");
  const params = new URLSearchParams(queryString);
  const token = params.get("token");

  const requestForm = document.getElementById("resetPasswordForm");
  console.log("requestForm:", requestForm);

  const newPasswordForm = document.getElementById("new-password-form");

  if (token) {
    // Mostrar formulario de nueva contraseña
    requestForm.style.display = "none";
    newPasswordForm.style.display = "block";

    // Evento para cambiar contraseña
    document
      .getElementById("newPasswordForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document
          .getElementById("confirmPassword")
          .value.trim();

        if (!password || password !== confirmPassword) {
          showToast("Las contraseñas no coinciden", "error");
          return;
        }

        const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
        if (!regexPassword.test(password)) {
          showToast(
            "La contraseña debe tener minúscula mayúscula y caracter especial",
            "error"
          );
          return;
        }

        await resetPasswordWithToken(token, password);
        showToast("Contraseña cambiada exitosamente", "success");
        window.location.href = "#/login";
      });
  } else {
    // Mostrar formulario de enviar correo
    requestForm.style.display = "block";
    newPasswordForm.style.display = "none";

    // Tu código actual para enviar el correo
    document
      .getElementById("resetPasswordForm")
      .addEventListener("submit", async function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        if (!email) {
          showToast("Por favor, ingresa un correo electrónico válido.", "error");
          return;
        }
        showToast("Email de cambio de contraseña enviado exitosamente", "success");
        await resetPassword(email);
        window.location.href = "#/login";
      });
  }
}

import { registerUser } from "../api/users";
import { showToast } from "../utils/toasts";

/**
 * Renders and manages the user registration form.
 *
 * This function:
 *  - Attaches a submit event listener to the form with id registerForm.
 *  - Validates user inputs:
 *    - Checks that the password matches the confirmation field.
 *    - Ensures the password includes at least one lowercase letter,
 *      one uppercase letter, one special character, and is at least 8 characters long.
 *  - Calls registerUser to send the user data to the backend.
 *  - Displays success or error messages using showToast or the #msg element.
 *  - Redirects to the login page (#/login) if registration succeeds.
 *
 * @function
 * @async
 * @returns {void} Does not return a value. Updates the DOM and may redirect the user.
 *
 * @throws {Error} Displays an error message in the UI if registration fails.
 *
 * @example
 * // HTML:
 * <form id="registerForm">
 *   <input id="nombres" type="text" required />
 *   <input id="apellidos" type="text" required />
 *   <input id="edad" type="number" required />
 *   <input id="email" type="email" required />
 *   <input id="password" type="password" required />
 *   <input id="confirmPassword" type="password" required />
 *   <button type="submit">Register</button>
 * </form>
 * <p id="msg"></p>
 *
 * // JS:
 * renderRegister();
 */

export function renderRegister() {
  // Obtener referencias a los elementos del formulario
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const passwordError = document.getElementById("passwordError");
  const confirmPasswordError = document.getElementById("confirmPasswordError");
  const submitBtn = document.querySelector("#registerForm button[type='submit']");

  // Función de validación en tiempo real para registro
  function validateRegisterForm() {
    let valid = true;

    // Validar contraseña - solo mostrar error si hay contenido
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (passwordInput.value.length > 0 && !passwordRegex.test(passwordInput.value)) {
      passwordError.textContent = 'Debe tener al menos 8 caracteres, mayúscula, minúscula y caracter especial';
      passwordInput.classList.add('error');
      passwordInput.classList.remove('valid');
      valid = false;
    } else {
      passwordError.textContent = '';
      passwordInput.classList.remove('error');
      if (passwordInput.value.length > 0) {
        passwordInput.classList.add('valid');
      }
    }

    // Validar confirmación de contraseña - solo mostrar error si hay contenido
    if (confirmPasswordInput.value.length > 0 && passwordInput.value !== confirmPasswordInput.value) {
      confirmPasswordError.textContent = 'Las contraseñas no coinciden';
      confirmPasswordInput.classList.add('error');
      confirmPasswordInput.classList.remove('valid');
      valid = false;
    } else {
      confirmPasswordError.textContent = '';
      confirmPasswordInput.classList.remove('error');
      if (confirmPasswordInput.value.length > 0) {
        confirmPasswordInput.classList.add('valid');
      }
    }

    // Habilitar/deshabilitar botón
    submitBtn.disabled = !valid;
  }

  // validación en tiempo real
  passwordInput.addEventListener('input', validateRegisterForm);
  confirmPasswordInput.addEventListener('input', validateRegisterForm);

  // Validación inicial
  validateRegisterForm();

  document
    .getElementById("registerForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      const firstName = document.getElementById("nombres").value.trim();
      const lastName = document.getElementById("apellidos").value.trim();
      const age = parseInt(document.getElementById("edad").value);
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const msg = document.getElementById("msg");
      
      // Validar que el formulario esté válido antes de enviar
      if (submitBtn.disabled) {
        showToast("Por favor, corrige los errores en el formulario", "error");
        return;
      }

      try {
        const newUser = {
          firstName,
          lastName,
          age,
          email,
          password,
        };
        await registerUser(newUser);


        showToast("Usuario creado exitosamente", "success");
        window.location.href = "#/login";

      } catch (err) {
        showToast(err.message || "Error en el registro", "error");
        console.error(err);
      }
    });
}

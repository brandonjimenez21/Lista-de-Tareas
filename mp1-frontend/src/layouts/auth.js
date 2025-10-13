

/**
 * Render the authentication layout (split screen: form on the left, image on the right).
 *
 * This layout:
 *  - Displays a logo and an authentication form (login, register, etc.) on the left.
 *  - Displays an illustration/image on the right.
 *
 * @function
 * @param {string} innerHtml - The HTML content to be placed inside the left section (e.g., login or register form).
 * @returns {string} The complete HTML string for the authentication layout.
 *
 * @example
 * // Render login form inside the layout
 * const html = renderAuthLayout(`
 *   <form id="loginForm">
 *     <input type="email" id="email" placeholder="Email" required />
 *     <input type="password" id="password" placeholder="Password" required />
 *     <button type="submit">Login</button>
 *   </form>
 * `);
 *
 * document.body.innerHTML = html;
 */

export async function renderAuthLayout(innerHtml) {
  // const logged = await isAuthenticated();
  // if (logged) {
  //   console.log("Redirigiendo a home");
  //   location.href = "/#/home";
  //   return;
  // }

  return `
    <section class="auth-container">
      <section class="auth-card">
        <div class="logo">
          <img
            src="logo.png"
            srcset="logo.png 1x, logo.png 2x"
            sizes="(max-width: 1024px) 140px, 180px"
            alt="Taskio logo"
            width="180" height="40"
          />
        </div>

        <main>
          ${innerHtml} <!-- Aquí entra el formulario (login, registro, etc.) -->
        </main>
      </section>

      <section class="image-box">
        <img src="login_photo.png" alt="Taskio ilustración">
      </section>
    </section>
  `;
}

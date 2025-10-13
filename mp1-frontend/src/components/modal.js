/**
 * Opens a modal dialog with the given inner HTML content.
 *
 * This function:
 *  - Injects the modal structure into the #modal-root element.
 *  - Adds a backdrop that closes the modal when clicked.
 *  - Prevents clicks inside the modal dialog from closing it.
 *  - Allows closing the modal by pressing the Escape key.
 *
 * @function
 * @param {string} innerHtml - The HTML content to be rendered inside the modal dialog.
 * @returns {void}
 *
 * @example
 * // HTML:
 * <div id="modal-root"></div>
 *
 * // JS:
 * openModal("<h2>Hello</h2><p>This is a modal</p>");
 */

// src/components/modal.js
export function openModal(innerHtml) {
    const root = document.getElementById('modal-root');
    root.innerHTML = `
      <div class="modal-backdrop" data-close="true"></div>
      <div class="modal-dialog" role="dialog" aria-modal="true">
        ${innerHtml}
      </div>
    `;
    root.classList.add('is-open');
  
    // Close when clicking backdrop
    const backdrop = root.querySelector('.modal-backdrop');
    backdrop.addEventListener('click', closeModal);
    
    // Prevent clicks inside the dialog from closing the modal
    const dialog = root.querySelector('.modal-dialog');
    dialog.addEventListener('click', (e) => e.stopPropagation());
  
        // Close with Escape key
    const onKey = (e) => {
        if (e.key === 'Escape') {
        closeModal();
        window.removeEventListener('keydown', onKey);
        }
    };
    window.addEventListener('keydown', onKey);
  }

  /**
   * Closes the currently open modal.
   * 
   * This function removes the modal content from `#modal-root`
   * and clears its HTML.
   * 
   * @function
   * @returns {void}
   * 
   * @example
   * // Close the modal programmatically
   * closeModal();
   */
  
  export function closeModal() {
    const root = document.getElementById('modal-root');
    if (!root) return;
    root.classList.remove('is-open');
    root.innerHTML = '';
  }
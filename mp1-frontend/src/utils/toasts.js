/**
 * Display a temporary toast notification on the screen.
 *
 * This function:
 *  - Creates a toast element with a message and type (success, error, info).
 *  - Styles it with basic positioning and colors.
 *  - Appends it to the DOM.
 *  - Automatically removes it after 3 seconds with a fade-out animation.
 *
 * @function
 * @param {string} message - The message to display inside the toast.
 * @param {"success"|"error"|"info"} [type="info"] - The type of toast, which determines its color.
 * @returns {void} Does not return a value. Modifies the DOM.
 *
 * @example
 * // Show a success message
 * showToast("Task created successfully", "success");
 *
 * @example
 * // Show an error message
 * showToast("Failed to save task", "error");
 *
 * @example
 * // Show an info message (default)
 * showToast("Loading data...");
 */
export function showToast(message, type = 'info') {
    // Create the toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Basic styles
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      transition: all 0.3s ease;
    `;
    
    // Type-based colors
    if (type === 'success') {
      toast.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
      toast.style.backgroundColor = '#ef4444';
    } else {
      toast.style.backgroundColor = '#3b82f6';
    }
    
    // Append to DOM
    document.body.appendChild(toast);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }
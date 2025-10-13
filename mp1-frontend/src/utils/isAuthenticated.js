export async function isAuthenticated() {
  try {
    const userId = localStorage.getItem("userId");
    return !!userId;
  } catch (error) {
    return false;
  }
}
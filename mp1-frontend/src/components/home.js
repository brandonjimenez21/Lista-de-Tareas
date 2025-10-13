import { taskStatistics } from "../api/tasks";

export async function initHome() {
  try {
    const stats = await taskStatistics();

    if (stats) {
      // 👉 Obtaining Statistics
      const totalStats = stats.total || 0;
      const statisticsByStatus = stats.byStatus || [];
      const completedStats = statisticsByStatus.find((s) => s.status === "done")?.count || 0;
      const pendingStats = statisticsByStatus.find((s) => s.status === "todo")?.count || 0;
      const inProgressStats = statisticsByStatus.find((s) => s.status === "in-progress")?.count || 0;

      // 👉 Obtaining DOM elements
      const totalTasks = document.getElementById("total-tasks");
      const completedTasks = document.getElementById("completed-tasks");
      const pendingTasks = document.getElementById("pending-tasks");

      // 👉 DOM Manipulation
      totalTasks.textContent = totalStats;
      completedTasks.textContent = completedStats;
      pendingTasks.textContent = pendingStats + inProgressStats;
    }
  } catch (error) {
    console.error(error);
  }
}
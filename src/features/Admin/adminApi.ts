import axiosClient from "../../api/axiosClient";

export interface AdminDashboardStatsDto {
  totalUsers: number;
  totalProjects: number;
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  cancelledTasks: number;
  overdueTasks: number;
}

export interface TasksByStatusDto {
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  overdue: number;
}

export interface TasksPerProjectDto {
  projectId: string;
  projectName: string;
  taskCount: number;
}

export interface TasksPerUserDto {
  userId: string;
  userName: string;
  taskCount: number;
}

export interface TasksOverTimeDto {
  date: string;
  created: number;
  completed: number;
}

export interface CalendarTaskDto {
  id: string;
  title: string;
  status: string;
  dueDate?: string;
  projectId: string;
  projectName: string;
}

export const fetchDashboardStats = () =>
  axiosClient.get<AdminDashboardStatsDto>("/admin/dashboard/stats");

export const fetchTasksByStatus = () =>
  axiosClient.get<TasksByStatusDto>("/admin/charts/tasks-by-status");

export const fetchTasksPerProject = () =>
  axiosClient.get<TasksPerProjectDto[]>("/admin/charts/tasks-per-project");

export const fetchTasksPerUser = () =>
  axiosClient.get<TasksPerUserDto[]>("/admin/charts/tasks-per-user");

export const fetchTasksOverTime = (startDate?: string, endDate?: string) =>
  axiosClient.get<TasksOverTimeDto[]>("/admin/charts/tasks-over-time", {
    params: { startDate, endDate },
  });

export const fetchCalendarTasks = (startDate?: string, endDate?: string) =>
  axiosClient.get<CalendarTaskDto[]>("/admin/calendar/tasks", {
    params: { startDate, endDate },
  });


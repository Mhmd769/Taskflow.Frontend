import { useEffect, useMemo, useState } from "react";
import {
  fetchCalendarTasks,
  fetchDashboardStats,
  fetchTasksByStatus,
  fetchTasksOverTime,
  fetchTasksPerProject,
  fetchTasksPerUser,
  type AdminDashboardStatsDto,
  type CalendarTaskDto,
  type TasksByStatusDto,
  type TasksOverTimeDto,
  type TasksPerProjectDto,
  type TasksPerUserDto,
} from "./adminApi";

type LoadingState = "idle" | "loading" | "error" | "success";

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "—";

const getStatusBadge = (status: string) => {
  const colors: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-700",
    InProgress: "bg-blue-100 text-blue-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-gray-100 text-gray-700",
    Overdue: "bg-red-100 text-red-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStatsDto | null>(null);
  const [statusData, setStatusData] = useState<TasksByStatusDto | null>(null);
  const [perProject, setPerProject] = useState<TasksPerProjectDto[]>([]);
  const [perUser, setPerUser] = useState<TasksPerUserDto[]>([]);
  const [timeline, setTimeline] = useState<TasksOverTimeDto[]>([]);
  const [calendarTasks, setCalendarTasks] = useState<CalendarTaskDto[]>([]);

  const [loading, setLoading] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading("loading");
      setError(null);
      try {
        const [
          statsRes,
          statusRes,
          projectRes,
          userRes,
          timelineRes,
          calendarRes,
        ] = await Promise.all([
          fetchDashboardStats(),
          fetchTasksByStatus(),
          fetchTasksPerProject(),
          fetchTasksPerUser(),
          fetchTasksOverTime(),
          fetchCalendarTasks(),
        ]);

        if (!mounted) return;
        const normalizeStatus = (status: any): string => {
          if (typeof status === "string") return status;
          switch (status) {
            case 0:
              return "Pending";
            case 1:
              return "InProgress";
            case 2:
              return "Completed";
            case 3:
              return "Cancelled";
            default:
              return "Pending";
          }
        };

        setStats(statsRes.data);
        setStatusData(statusRes.data);
        setPerProject(projectRes.data);
        setPerUser(userRes.data);
        setTimeline(timelineRes.data);
        setCalendarTasks(
          calendarRes.data.map((t) => ({
            ...t,
            status: normalizeStatus((t as any).status),
          }))
        );
        setLoading("success");
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || "Failed to load admin dashboard");
        setLoading("error");
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const totalTasks = useMemo(() => stats?.totalTasks ?? 0, [stats]);

  const statusEntries = useMemo(() => {
    if (!statusData) return [];
    return [
      { label: "Pending", value: statusData.pending, color: "bg-amber-500" },
      { label: "In Progress", value: statusData.inProgress, color: "bg-blue-500" },
      { label: "Completed", value: statusData.completed, color: "bg-emerald-500" },
      { label: "Cancelled", value: statusData.cancelled, color: "bg-gray-500" },
      { label: "Overdue", value: statusData.overdue, color: "bg-red-500" },
    ];
  }, [statusData]);

  const maxProjectCount = Math.max(...perProject.map((p) => p.taskCount), 1);
  const maxUserCount = Math.max(...perUser.map((p) => p.taskCount), 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-blue-600 uppercase">Admin</p>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
              Secure • Admin Only
            </span>
          </div>
          <p className="text-sm text-gray-500">
            KPIs, charts, and calendar data powered by the new admin endpoints.
          </p>
        </div>

        {loading === "loading" && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-24 rounded-2xl bg-white shadow-sm border border-gray-100" />
            ))}
          </div>
        )}

        {loading === "error" && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {loading === "success" && stats && (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <KpiCard title="Total Users" value={stats.totalUsers} />
              <KpiCard title="Total Projects" value={stats.totalProjects} />
              <KpiCard title="Total Tasks" value={stats.totalTasks} />
              <KpiCard title="Overdue Tasks" value={stats.overdueTasks} highlight />
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-2xl bg-white shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Task Status</h2>
                  <span className="text-sm text-gray-500">Pie/Donut (textual)</span>
                </div>
                <div className="space-y-3">
                  {statusEntries.map((item) => {
                    const pct = totalTasks ? Math.round((item.value / totalTasks) * 100) : 0;
                    return (
                      <div key={item.label} className="space-y-1">
                        <div className="flex items-center justify-between text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                            <span>{item.label}</span>
                          </div>
                          <span className="font-semibold">
                            {item.value} <span className="text-xs text-gray-400">({pct}%)</span>
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={`h-full ${item.color}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Tasks Summary</h2>
                  <span className="text-sm text-gray-500">Counts</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <SummaryChip label="Pending" value={stats.pendingTasks} color="bg-amber-100 text-amber-700" />
                  <SummaryChip label="In Progress" value={stats.inProgressTasks} color="bg-blue-100 text-blue-700" />
                  <SummaryChip label="Completed" value={stats.completedTasks} color="bg-emerald-100 text-emerald-700" />
                  <SummaryChip label="Cancelled" value={stats.cancelledTasks} color="bg-gray-100 text-gray-700" />
                  <SummaryChip label="Overdue" value={stats.overdueTasks} color="bg-red-100 text-red-700" />
                </div>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <ListChartCard
                title="Tasks per Project"
                items={perProject.map((p) => ({
                  label: p.projectName || "Unnamed",
                  value: p.taskCount,
                }))}
                maxValue={maxProjectCount}
              />
              <ListChartCard
                title="Tasks per User"
                items={perUser.map((u) => ({
                  label: u.userName || "User",
                  value: u.taskCount,
                }))}
                maxValue={maxUserCount}
              />
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-2xl bg-white shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Tasks Over Time</h2>
                  <span className="text-sm text-gray-500">Created vs Completed</span>
                </div>
                <div className="space-y-3">
                  {timeline.map((item) => (
                    <div key={item.date} className="space-y-1">
                      <div className="flex items-center justify-between text-sm text-gray-700">
                        <span>{formatDate(item.date)}</span>
                        <span className="text-xs text-gray-500">
                          Created: {item.created} • Completed: {item.completed}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden flex">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${Math.min(item.created * 8, 100)}%` }}
                          title="Created"
                        />
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${Math.min(item.completed * 8, 100)}%` }}
                          title="Completed"
                        />
                      </div>
                    </div>
                  ))}
                  {timeline.length === 0 && (
                    <p className="text-sm text-gray-500">No data in the selected range.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Calendar Tasks</h2>
                  <span className="text-sm text-gray-500">Due within window</span>
                </div>
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {calendarTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white transition"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900">{task.title}</p>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadge(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Due {formatDate(task.dueDate)} • {task.projectName}
                      </div>
                    </div>
                  ))}
                  {calendarTasks.length === 0 && (
                    <p className="text-sm text-gray-500">No tasks in the selected date range.</p>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function KpiCard({ title, value, highlight }: { title: string; value: number; highlight?: boolean }) {
  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white shadow-sm p-4 space-y-2 ${
        highlight ? "ring-2 ring-red-100" : ""
      }`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function SummaryChip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`rounded-xl px-3 py-3 border border-gray-100 bg-gray-50`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-lg font-semibold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

function ListChartCard({
  title,
  items,
  maxValue,
}: {
  title: string;
  items: { label: string; value: number }[];
  maxValue: number;
}) {
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500">Bar</span>
      </div>
      <div className="space-y-3">
        {items.map((item) => {
          const pct = maxValue ? Math.round((item.value / maxValue) * 100) : 0;
          return (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span className="truncate">{item.label}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
            </div>
          );
        })}
        {items.length === 0 && <p className="text-sm text-gray-500">No data available.</p>}
      </div>
    </div>
  );
}


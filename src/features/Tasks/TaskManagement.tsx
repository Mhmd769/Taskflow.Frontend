import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Circle,
  PlayCircle,
  CheckCircle2,
  GripVertical,
  Clock,
  Users,
  MoreHorizontal,
  Plus
} from "lucide-react";

import {
  fetchTasks,
  changeTaskStatus,
  type Task,
} from "../Tasks/TasksSlice";
import type { RootState, AppDispatch } from "../../store/store";

const columns = {
  0: "Pending",
  1: "InProgress",
  2: "Completed",
};

export default function TaskManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { list: tasks, loading } = useSelector(
    (state: RootState) => state.task
  );

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const tasksByStatus = {
    Pending: tasks.filter((t) => String(t.status) === "Pending" || String(t.status) === "0"),
    InProgress: tasks.filter((t) => String(t.status) === "InProgress" || String(t.status) === "1"),
    Completed: tasks.filter((t) => String(t.status) === "Completed" || String(t.status) === "2"),
  };

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const fromCol = source.droppableId;
    const toCol = destination.droppableId;

    if (fromCol === toCol && source.index === destination.index) return;

    const newStatusNumber =
      toCol === "Pending"
        ? 0
        : toCol === "InProgress"
        ? 1
        : 2;

    dispatch(
      changeTaskStatus({
        taskId: draggableId,
        newStatus: newStatusNumber,
      })
    );
  };

  const handleManualChange = (task: Task, newStatus: string) => {
    const newStatusNum =
      newStatus === "Pending"
        ? 0
        : newStatus === "InProgress"
        ? 1
        : 2;

    dispatch(
      changeTaskStatus({
        taskId: task.id,
        newStatus: newStatusNum,
      })
    );
  };

  const getColumnConfig = (status: string) => {
    const configs = {
      Pending: {
        icon: <Circle size={18} className="text-blue-600" />,
        bgColor: "bg-blue-50",
        iconBg: "bg-blue-100",
        count: tasksByStatus.Pending.length,
      },
      InProgress: {
        icon: <PlayCircle size={18} className="text-purple-600" />,
        bgColor: "bg-purple-50",
        iconBg: "bg-purple-100",
        count: tasksByStatus.InProgress.length,
      },
      Completed: {
        icon: <CheckCircle2 size={18} className="text-green-600" />,
        bgColor: "bg-green-50",
        iconBg: "bg-green-100",
        count: tasksByStatus.Completed.length,
      }
    };
    return configs[status as keyof typeof configs];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    const now = new Date();
    const isOverdue = date < now;
    
    return {
      text: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      isOverdue
    };
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-green-500',
      'bg-indigo-500',
      'bg-violet-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Task Management</h1>
              <p className="text-gray-600 text-sm">Manage and organize your tasks</p>
            </div>
            
            {/* Stats Summary */}
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="text-lg font-bold text-gray-900 ml-2">{tasksByStatus.Pending.length}</span>
                </div>
              </div>
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="text-lg font-bold text-gray-900 ml-2">{tasksByStatus.InProgress.length}</span>
                </div>
              </div>
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="text-lg font-bold text-gray-900 ml-2">{tasksByStatus.Completed.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-3 border-gray-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading tasks...</p>
          </div>
        )}

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {Object.keys(tasksByStatus).map((statusKey) => {
              const config = getColumnConfig(statusKey);
              
              return (
                <Droppable droppableId={statusKey} key={statusKey}>
                  {(provided, snapshot) => (
                    <div
                      className={`flex-shrink-0 w-[340px] transition-all duration-200`}
                    >
                      {/* Column Header */}
                      <div className={`${config.bgColor} rounded-t-lg px-4 py-3 border border-gray-200 border-b-0`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`${config.iconBg} rounded-lg p-1.5`}>
                              {config.icon}
                            </div>
                            <h2 className="font-semibold text-sm text-gray-900">
                              {statusKey === "InProgress" ? "In Progress" : statusKey}
                            </h2>
                            <span className="text-xs text-gray-500 font-medium bg-white px-2 py-0.5 rounded-full border border-gray-200">
                              {config.count}
                            </span>
                          </div>
                          <button className="p-1 hover:bg-white/50 rounded transition-colors">
                            <MoreHorizontal size={16} className="text-gray-500" />
                          </button>
                        </div>
                      </div>

                      {/* Tasks Container */}
                      <div
                        className={`bg-white rounded-b-lg p-3 min-h-[calc(100vh-280px)] border border-gray-200 transition-all ${
                          snapshot.isDraggingOver ? 'bg-blue-50 ring-2 ring-blue-500' : ''
                        }`}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        <div className="space-y-2.5">
                          {tasksByStatus[statusKey as keyof typeof tasksByStatus].map(
                            (task: Task, index: number) => (
                              <Draggable
                                key={task.id}
                                draggableId={task.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    className={`group bg-white rounded-lg shadow-sm border border-gray-200 p-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-gray-300 ${
                                      snapshot.isDragging 
                                        ? 'shadow-xl ring-2 ring-blue-500 rotate-2 scale-105' 
                                        : ''
                                    }`}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {/* Task Title */}
                                    <h3 className="font-medium text-gray-900 text-sm mb-2 leading-snug">
                                      {task.title}
                                    </h3>

                                    {/* Description */}
                                    {task.description && (
                                      <p className="text-xs text-gray-600 mb-3 leading-relaxed line-clamp-2">
                                        {task.description}
                                      </p>
                                    )}

                                    {/* Labels/Tags */}

                                    <div className="flex flex-wrap gap-1 mb-3">
                                    {statusKey === "Pending" && (
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                          Pending
                                        </span>
                                      )}

                                      {statusKey === "InProgress" && (
                                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                          Active
                                        </span>
                                      )}
                                      {statusKey === "Completed" && (
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                                          Done
                                        </span>
                                      )}
                                    </div>

                                    {/* Footer - Due Date and Avatars */}
                                    <div className="flex items-center justify-between text-xs">
                                      {/* Due Date */}
                                      {task.dueDate ? (
                                        (() => {
                                          const dateInfo = formatDate(task.dueDate);
                                          const isOverdue = typeof dateInfo === 'object' ? dateInfo.isOverdue : false;
                                          const dateText = typeof dateInfo === 'object' ? dateInfo.text : dateInfo;
                                          return (
                                            <div className={`flex items-center gap-1 px-2 py-1 rounded ${
                                              isOverdue 
                                                ? 'bg-red-50 text-red-600 border border-red-200' 
                                                : 'bg-gray-50 text-gray-600 border border-gray-200'
                                            }`}>
                                              <Clock size={12} />
                                              <span className="font-medium">
                                                {dateText}
                                              </span>
                                            </div>
                                          );
                                        })()
                                      ) : (
                                        <div></div>
                                      )}

                                      {/* Assigned Users - Avatar Stack */}
                                      {task.assignedUserNames && task.assignedUserNames.length > 0 && (
                                        <div className="flex -space-x-2">
                                          {task.assignedUserNames.slice(0, 3).map((name, idx) => (
                                            <div
                                              key={idx}
                                              className={`w-7 h-7 rounded-full ${getAvatarColor(idx)} flex items-center justify-center text-white text-xs font-semibold border-2 border-white shadow-sm`}
                                              title={name}
                                            >
                                              {getInitials(name)}
                                            </div>
                                          ))}
                                          {task.assignedUserNames.length > 3 && (
                                            <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-semibold border-2 border-white shadow-sm">
                                              +{task.assignedUserNames.length - 3}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>

                                    {/* Hidden Status Selector for Accessibility */}
                                    <select
                                      className="hidden"
                                      value={task.status}
                                      onChange={(e) =>
                                        handleManualChange(task, e.target.value)
                                      }
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="InProgress">In Progress</option>
                                      <option value="Completed">Completed</option>
                                    </select>
                                  </div>
                                )}
                              </Draggable>
                            )
                          )}
                        </div>
                        
                        {provided.placeholder}

                        {/* Add Card Button */}
                        <button className="w-full mt-2 p-2.5 text-left text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 border border-dashed border-gray-300">
                          <Plus size={16} />
                          Add a card
                        </button>

                        {/* Empty State */}
                        {tasksByStatus[statusKey as keyof typeof tasksByStatus].length === 0 && (
                          <div className="text-center py-8">
                            <div className="text-3xl mb-2 opacity-30">📋</div>
                            <p className="text-gray-400 text-sm font-medium">No tasks</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
import { useState } from "react";
import type { ListViewTaskProps, UseListViewTask } from "./ListViewTask.types";
import type { TaskResponse } from "@/api/Tasks/apiTaskTypes";

export const useListViewTask = ({task, updateTask}: Pick<ListViewTaskProps, 'task' | 'updateTask'>): UseListViewTask => {
  const [statusAnchor, setStatusAnchor] = useState<null | HTMLElement>(null);
  const [priorityAnchor, setPriorityAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [dateAnchor, setDateAnchor] = useState<null | HTMLElement>(null);

  const handlePrioritySelect = async (level: number) => {
    setPriorityAnchor(null);
    if (updateTask && task.priority_level !== level) {
      await updateTask(task.id, { ...task, priority_level: level });
    }
  };

  const handleDateSelect = async (daysToAdd: number) => {
    setDateAnchor(null);
    if (updateTask) {
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + daysToAdd);
      await updateTask(task.id, { ...task, deadline: newDate.toISOString() });
    }
  };

  const handleStatusSelect = async (status: string) => {
    setStatusAnchor(null);
    if (updateTask && task.status !== status) {
      await updateTask(task.id, {
        ...task,
        status: status as TaskResponse['status'],
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Done: '#22c55e',
      Todo: '#3b82f6',
      Planning: '#8b5cf6',
      Pending: '#f59e0b',
      'On Hold': '#ef4444',
      Review: '#06b6d4',
      Backlog: '#6b7280',
      Scheduled: '#8b5cf6',
      Archived: '#4b5563',
    };
    return colors[status] || '#6b7280';
  };

  const getPriorityColor = (level: number) => {
    if (level >= 3) return '#ef4444';
    if (level === 2) return '#f59e0b';
    return '#22c55e';
  };

  const statusColor = getStatusColor(task.status);
  const priorityColor = getPriorityColor(task.priority_level);


  return {
    statusAnchor,
    setStatusAnchor,
    priorityAnchor,
    setPriorityAnchor,
    dateAnchor,
    setDateAnchor,
    handlePrioritySelect,
    handleDateSelect,
    handleStatusSelect,
    getStatusColor,
    getPriorityColor,
    statusColor,
    priorityColor,
  }
}
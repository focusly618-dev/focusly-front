import { TaskDetailModal } from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal';
import type { CreateTaskModalProps } from './types/CreateTaskModal.types';

export const CreateTaskModal = (props: CreateTaskModalProps) => {
  return <TaskDetailModal {...props} />;
};

import axios from '@/api/axiosInstance';

export interface TimeBlockResponse {
  id: string;
  userId: string;
  taskId?: string;
  startTime: string;
  endTime: string;
  blockType: 'Focus_Block' | 'Break' | 'External_Event' | 'Meeting';
  externalEventId?: string;
  source: 'App' | 'Google' | 'Outlook';
  isLocked: boolean;
  title: string;
  meetingUrl?: string;
  attendees?: Array<{ email: string; responseStatus?: string; name?: string }>;
  createdAt: string;
}

export const fetchTimeBlocks = async (
  userId: string,
): Promise<TimeBlockResponse[]> => {
  const response = await axios.get(`/time-blocks/user/${userId}`);
  return (response.data || []) as TimeBlockResponse[];
};

export const createTimeBlock = async (
  blockData: Partial<TimeBlockResponse>,
): Promise<string> => {
  const response = await axios.post('/time-blocks', blockData);
  return response.data;
};

export const fetchTimeBlockById = async (
  id: string,
): Promise<TimeBlockResponse> => {
  const response = await axios.get(`/time-blocks/${id}`);
  return response.data;
};

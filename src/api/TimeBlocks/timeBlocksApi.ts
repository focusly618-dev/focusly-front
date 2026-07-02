import axios from '@/api/axiosInstance';
import type { TimeBlockResponse } from './timeBlocksApi.types';

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

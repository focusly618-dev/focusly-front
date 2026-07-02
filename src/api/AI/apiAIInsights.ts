import { API_BASE_URL } from '@/config/env.config';
import axios from 'axios';
import type { PatternAnalysisResponse } from './apiAI.types';

export type {
  PatternChip,
  PatternAnalysisData,
  PatternAnalysisResponse,
} from './apiAI.types';

const getAnalyzePatternsEndpoint = () => {
  const isDev = import.meta.env.DEV;
  const baseUrl = isDev ? '' : API_BASE_URL;
  return `${baseUrl}/ai/analyze-patterns`;
};

export const fetchAIBehavioralPatterns =
  async (): Promise<PatternAnalysisResponse> => {
    const endpoint = getAnalyzePatternsEndpoint();
    const makeRequest = () =>
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

    let response = await makeRequest();

    if (response.status === 401) {
      try {
        const { store } = await import('@/redux/store');
        const user = store.getState().auth.user;
        if (user) {
          await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { userId: user.id },
            { withCredentials: true },
          );
          response = await makeRequest();
        }
      } catch (refreshErr) {
        console.error(
          'Failed to refresh token during pattern analysis fetch:',
          refreshErr,
        );
      }
    }

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  };

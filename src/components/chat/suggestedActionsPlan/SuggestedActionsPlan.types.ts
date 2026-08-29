import type { ParsedLuminaAction } from '@/utils';

export interface SuggestedActionsPlanProps {
  actions: ParsedLuminaAction[];
}

export type PlanItemStatus = 'pending' | 'creating' | 'done' | 'error';

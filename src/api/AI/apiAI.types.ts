export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AITaskContext {
  title: string;
  description: string;
  status: string;
  priority_level: number;
  estimate_timer: number;
  real_timer?: number;
  deadline: string;
  links?: { title: string; url: string }[];
}

export interface PatternChip {
  label: string;
  icon: string;
}

export interface PatternAnalysisData {
  goldenHours: string;
  goldenHoursConfidence: number;
  behaviorSummary: string;
  patterns: PatternChip[];
  workStyle: string;
}

export interface PatternAnalysisResponse {
  success: boolean;
  data: PatternAnalysisData;
}

export interface AIPlanItem {
  taskId: string;
  recommendedPriority: 'HIGH' | 'MEDIUM' | 'LOW';
  suggestedOrder: number;
  reason: string;
  suggestedDate?: string;
  estimatedTime?: string;
}

export interface AIOrganizeResponse {
  plan: AIPlanItem[];
}

export interface AITimeBlockItem {
  taskId?: string;
  title: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  reason: string;
}

export interface AICalendarPlannerResponse {
  events: AITimeBlockItem[];
}

export interface AIWeeklyPlanDayItem {
  day: string;
  tasks: string[];
}

export interface AIWeeklyPlanResponse {
  weeklyPlan: AIWeeklyPlanDayItem[];
  recommendationSummary: string;
}

export interface AIImproveTaskResponse {
  subtasks?: string[];
  estimatedTime?: string;
  suggestedPriority?: string;
}

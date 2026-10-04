import type { PlanController } from '../useActionPlan.hook';

export interface NodeProps {
  plan: PlanController;
}

/** Status/selection props every node passes to its PlanItem. */
export const itemState = (plan: PlanController, index: number) => ({
  index,
  status: plan.statuses[index],
  selected: plan.selected.has(index),
  canEdit: plan.canEdit(index),
  onToggle: () => plan.toggle(index),
});

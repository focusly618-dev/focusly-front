import { describe, expect, it } from 'vitest';
import { defaultStartForDay } from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';

const at = (h: number, m = 0, d = 10) => new Date(2026, 10, d, h, m);

describe('defaultStartForDay', () => {
  it('another day starts when the workday does', () => {
    expect(defaultStartForDay(at(0, 0, 13), at(22, 40))).toEqual(at(9, 0, 13));
    expect(defaultStartForDay(at(0, 0, 13), at(8), '08:30')).toEqual(
      at(8, 30, 13),
    );
  });

  it('today, before work, also starts then', () => {
    expect(defaultStartForDay(at(0), at(7))).toEqual(at(9));
  });

  it('today, later on, takes the next half hour', () => {
    expect(defaultStartForDay(at(0), at(15, 12))).toEqual(at(15, 30));
    expect(defaultStartForDay(at(0), at(15, 30))).toEqual(at(16));
    expect(defaultStartForDay(at(0), at(15, 45))).toEqual(at(16));
  });

  it('never rolls over to the next day', () => {
    expect(defaultStartForDay(at(0), at(23, 50))).toEqual(at(23, 30));
  });

  it('ignores an unreadable work start', () => {
    expect(defaultStartForDay(at(0, 0, 13), at(8), 'nope')).toEqual(
      at(9, 0, 13),
    );
  });
});

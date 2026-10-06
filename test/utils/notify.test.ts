import { describe, it, expect, vi, beforeEach } from 'vitest';

const sonner = vi.hoisted(() => {
  const toast = {
    success: vi.fn((_t: string, o: { id: string }) => o.id),
    error: vi.fn((_t: string, o: { id: string }) => o.id),
    warning: vi.fn((_t: string, o: { id: string }) => o.id),
    info: vi.fn((_t: string, o: { id: string }) => o.id),
    loading: vi.fn((_t: string, o: { id: string }) => o.id),
    dismiss: vi.fn(),
  };
  return { toast };
});
vi.mock('sonner', () => sonner);

const { notify, NOTIFY_DURATIONS, NOTIFY_ACTION_DURATION } =
  await import('@/utils/notifications/notify');

describe('notify', () => {
  beforeEach(() => vi.clearAllMocks());

  it('successes are short, errors stay longer', () => {
    notify.success({ title: 'Guardado' });
    notify.error({ title: 'Falló', description: 'Sin conexión' });
    expect(sonner.toast.success).toHaveBeenCalledWith(
      'Guardado',
      expect.objectContaining({ duration: NOTIFY_DURATIONS.success }),
    );
    expect(sonner.toast.error).toHaveBeenCalledWith(
      'Falló',
      expect.objectContaining({
        description: 'Sin conexión',
        duration: NOTIFY_DURATIONS.error,
      }),
    );
    expect(NOTIFY_DURATIONS.success).toBeLessThan(NOTIFY_DURATIONS.error);
  });

  it('the same message twice replaces itself instead of piling up', () => {
    const first = notify.success({ title: 'Tarea actualizada' });
    const second = notify.success({ title: 'Tarea actualizada' });
    expect(first).toBe(second);
  });

  it('a toast with a button stays long enough to use it', () => {
    const onClick = vi.fn();
    notify.success({
      title: 'Completada',
      button: { title: 'Deshacer', onClick },
    });
    const options = sonner.toast.success.mock.calls[0][1] as unknown as {
      duration: number;
      action: { label: string; onClick: () => void };
    };
    expect(options.duration).toBe(NOTIFY_ACTION_DURATION);
    expect(options.action.label).toBe('Deshacer');
    options.action.onClick();
    expect(onClick).toHaveBeenCalled();
  });

  it('promise: one toast that goes from loading to the result', async () => {
    await notify.promise(Promise.resolve(1), {
      loading: { title: 'Guardando…' },
      success: { title: 'Listo' },
      error: { title: 'Error' },
    });
    const loadingId = (
      sonner.toast.loading.mock.calls[0][1] as unknown as { id: string }
    ).id;
    expect(sonner.toast.success).toHaveBeenCalledWith(
      'Listo',
      expect.objectContaining({ id: loadingId }),
    );

    await expect(
      notify.promise(Promise.reject(new Error('x')), {
        loading: { title: 'Guardando…' },
        success: { title: 'Listo' },
        error: { title: 'No se guardó' },
      }),
    ).rejects.toThrow('x');
    expect(sonner.toast.error).toHaveBeenCalledWith(
      'No se guardó',
      expect.any(Object),
    );
  });
});

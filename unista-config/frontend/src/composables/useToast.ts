import { reactive } from "vue";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  description?: string;
  duration?: number;
}

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  description?: string;
}

const DEFAULT_DURATION: Record<ToastType, number> = {
  success: 4000,
  error: 6000,
  warning: 5000,
  info: 4000,
};

const state = reactive<{ toasts: Toast[] }>({ toasts: [] });
let nextId = 0;
const timers = new Map<number, ReturnType<typeof setTimeout>>();

function dismiss(id: number): void {
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }
  const index = state.toasts.findIndex((t) => t.id === id);
  if (index !== -1) state.toasts.splice(index, 1);
}

function resolveOptions(options?: number | ToastOptions): ToastOptions {
  if (typeof options === "number") return { duration: options };
  return options ?? {};
}

function push(type: ToastType, message: string, options?: number | ToastOptions): number {
  const { description, duration } = resolveOptions(options);
  const id = ++nextId;
  const resolvedDuration = duration ?? DEFAULT_DURATION[type];
  state.toasts.push({ id, type, message, description });

  if (resolvedDuration > 0) {
    const timer = setTimeout(() => dismiss(id), resolvedDuration);
    timers.set(id, timer);
  }

  return id;
}

export const toast = {
  success: (message: string, options?: number | ToastOptions) =>
    push("success", message, options),
  error: (message: string, options?: number | ToastOptions) => push("error", message, options),
  warning: (message: string, options?: number | ToastOptions) =>
    push("warning", message, options),
  info: (message: string, options?: number | ToastOptions) => push("info", message, options),
  dismiss,
};

export function useToast() {
  return {
    toasts: state.toasts,
    dismiss,
  };
}

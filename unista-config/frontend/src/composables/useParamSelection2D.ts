import { computed, ref } from "vue";

export function useParamSelection2D<TParam>(
  getParam: (idx1: number, idx2: number) => TParam | null,
  options?: { canOpen?: () => boolean; canClose?: () => boolean },
) {
  const idx1 = ref<number | null>(null);
  const idx2 = ref<number | null>(null);

  const activeParam = computed(() => {
    if (idx1.value === null || idx2.value === null) return null;
    return getParam(idx1.value, idx2.value);
  });

  const open = (a: number, b: number) => {
    if (options?.canOpen && !options.canOpen()) return;
    idx1.value = a;
    idx2.value = b;
  };

  const close = () => {
    if (options?.canClose && !options.canClose()) return;
    idx1.value = null;
    idx2.value = null;
  };

  return { idx1, idx2, activeParam, open, close };
}

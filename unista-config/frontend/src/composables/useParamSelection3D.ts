import { computed, ref } from "vue";

export function useParamSelection3D<TParam>(
  getParam: (a: number, b: number, c: number) => TParam | null,
) {
  const idx1 = ref<number | null>(null);
  const idx2 = ref<number | null>(null);
  const idx3 = ref<number | null>(null);

  const activeParam = computed(() => {
    if (idx1.value === null || idx2.value === null || idx3.value === null)
      return null;
    return getParam(idx1.value, idx2.value, idx3.value);
  });

  const open = (a: number, b: number, c: number) => {
    idx1.value = a;
    idx2.value = b;
    idx3.value = c;
  };

  const close = () => {
    idx1.value = null;
    idx2.value = null;
    idx3.value = null;
  };

  return { idx1, idx2, idx3, activeParam, open, close };
}

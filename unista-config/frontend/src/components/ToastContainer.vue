<template>
  <Teleport to="body">
    <div
      class="fixed bottom-4 right-4 z-200 flex flex-col-reverse gap-2 w-[min(100vw-2rem,20rem)] pointer-events-none"
      aria-live="polite"
      aria-relevant="additions removals"
    >
      <TransitionGroup name="toast">
        <div
          v-for="item in toasts"
          :key="item.id"
          :class="[
            'pointer-events-auto flex gap-2 pl-2.5 pr-1.5 py-1.5 border shadow-sm backdrop-blur-md',
            item.description ? 'items-start rounded-2xl' : 'items-center rounded-full',
            item.description && isLongDescription(item.description)
              ? 'max-w-[min(100vw-2rem,24rem)]'
              : '',
            styles[item.type].container,
          ]"
          role="alert"
        >
          <AppIcon
            :name="icons[item.type]"
            :size="14"
            :class="['shrink-0', item.description ? 'mt-0.5' : '', styles[item.type].icon]"
          />

          <div class="flex-1 min-w-0 py-0.5">
            <p :class="['text-[11px] font-semibold leading-tight', styles[item.type].title]">
              {{ item.message }}
            </p>
            <p
              v-if="item.description"
              :class="[
                'text-[10px] leading-snug mt-0.5 break-words',
                isLongDescription(item.description) ? 'line-clamp-4' : '',
                styles[item.type].description,
              ]"
            >
              {{ item.description }}
            </p>
          </div>

          <button
            type="button"
            :class="['shrink-0 p-1 rounded-full transition-colors', styles[item.type].close]"
            aria-label="Close"
            @click="dismiss(item.id)"
          >
            <AppIcon name="x" :size="12" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import AppIcon from "./AppIcon.vue";
import { useToast, type ToastType } from "../composables/useToast";

const { toasts, dismiss } = useToast();

const icons: Record<ToastType, string> = {
  success: "circle-check",
  error: "triangle-alert",
  warning: "triangle-alert",
  info: "info",
};

function isLongDescription(text: string): boolean {
  return text.length > 48;
}

const styles: Record<
  ToastType,
  { container: string; icon: string; title: string; description: string; close: string }
> = {
  success: {
    container: "bg-emerald-50/95 border-emerald-200/70 shadow-emerald-900/5",
    icon: "text-emerald-700",
    title: "text-emerald-900",
    description: "text-emerald-700/80",
    close: "text-emerald-600/60 hover:text-emerald-800 hover:bg-emerald-100/80",
  },
  error: {
    container: "bg-rose-50/95 border-rose-200/70 shadow-rose-900/5",
    icon: "text-rose-700",
    title: "text-rose-900",
    description: "text-rose-700/80",
    close: "text-rose-600/60 hover:text-rose-800 hover:bg-rose-100/80",
  },
  warning: {
    container: "bg-amber-50/95 border-amber-200/70 shadow-amber-900/5",
    icon: "text-amber-700",
    title: "text-amber-900",
    description: "text-amber-700/80",
    close: "text-amber-600/60 hover:text-amber-800 hover:bg-amber-100/80",
  },
  info: {
    container: "bg-sky-50/95 border-sky-200/70 shadow-sky-900/5",
    icon: "text-sky-700",
    title: "text-sky-900",
    description: "text-sky-700/80",
    close: "text-sky-600/60 hover:text-sky-800 hover:bg-sky-100/80",
  },
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(0.75rem) scale(0.96);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(0.5rem) scale(0.96);
}

.toast-move {
  transition: transform 0.22s ease;
}
</style>

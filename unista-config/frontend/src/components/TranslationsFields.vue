<template>
  <!-- Language comment fields (FR / EN / DE / ES) -->
  <div v-for="lang in LANGS" :key="lang.code">
    <label
      class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 mb-1 flex items-center gap-1"
    >
      <span
        :class="[
          'text-[11px] px-1 py-0.5 rounded font-black',
          lang.bg,
          lang.text,
        ]"
        >{{ lang.code }}</span
      >
      Comment
    </label>
    <input
      type="text"
      :value="(item as any)[lang.field]"
      @input="
        (item as any)[lang.field] = ($event.target as HTMLInputElement).value
      "
      class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
    />
  </div>

  <hr class="border-gray-100 my-1.5" />

  <!-- Extra fields: reserve1, reserve2, detail -->
  <div v-for="f in EXTRA_FIELDS" :key="f.field">
    <label
      class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 mb-1"
      >{{ f.label }}</label
    >

    <!--
      Detail field: auto-expanding textarea.
      `autoResize` resets height to "auto" first so the scrollHeight shrinks
      correctly when text is deleted, then snaps to the exact content height.
    -->
    <textarea
      v-if="f.field === 'detail'"
      rows="1"
      :value="(item as any)[f.field]"
      @input="
        (item as any)[f.field] = ($event.target as HTMLTextAreaElement).value;
        autoResize($event.target as HTMLTextAreaElement);
      "
      class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none overflow-hidden leading-5"
    />

    <!-- All other extra fields stay as a single-line input -->
    <input
      v-else
      type="text"
      :value="(item as any)[f.field]"
      @input="
        (item as any)[f.field] = ($event.target as HTMLInputElement).value
      "
      class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * TranslationsFields
 * Renders the 4 translation comment fields (FR/EN/DE/ES) + detail/reserve1/reserve2.
 * Mutates the passed object directly (shared-store pattern).
 *
 * The "Detail" field is an auto-expanding textarea: it grows with its content
 * and shrinks back when text is removed.
 *
 * Prop:
 *   item — object with commentFr/commentEn/commentDe/commentEs/detail/reserve1/reserve2
 */
defineProps<{ item: object }>();

const LANGS = [
  { code: "FR", field: "commentFr", bg: "bg-blue-100", text: "text-blue-800" },
  { code: "EN", field: "commentEn", bg: "bg-red-100", text: "text-red-800" },
  {
    code: "DE",
    field: "commentDe",
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  {
    code: "ES",
    field: "commentEs",
    bg: "bg-orange-100",
    text: "text-orange-800",
  },
] as const;

const EXTRA_FIELDS = [
  { label: "Reserve 1", field: "reserve1" },
  { label: "Reserve 2", field: "reserve2" },
  { label: "Detail", field: "detail" },
] as const;

/**
 * Resizes a textarea to exactly fit its content.
 * Resetting to "auto" first ensures the element can shrink when text is deleted.
 */
function autoResize(el: HTMLTextAreaElement): void {
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}
</script>

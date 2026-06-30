import * as icons from "@lucide/vue";
import type { Component } from "vue";

/** Legacy / shorthand names that don't match Lucide kebab-case conversion. */
const ALIASES: Record<string, keyof typeof icons> = {
  "information-circle": "Info",
  adjustments: "SlidersHorizontal",
  cog: "Cog",
};

function toPascalCase(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export function resolveLucideIcon(name: string): Component {
  if (!name) return icons.CircleHelp;

  const trimmed = name.trim();

  if (trimmed in icons) {
    return icons[trimmed as keyof typeof icons] as Component;
  }

  const alias = ALIASES[trimmed];
  if (alias) return icons[alias] as Component;

  const pascal = toPascalCase(trimmed);
  if (pascal in icons) {
    return icons[pascal as keyof typeof icons] as Component;
  }

  return icons.CircleHelp;
}

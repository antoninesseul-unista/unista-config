import { ref } from "vue";
import type { MessageBoxEntity, Parameter } from "../types";
import { generateId, makeParam } from "../utils/helpers";

/**
 * Creates a blank Parameter to be used for a Message Box field.
 */
const createMsgParam = (name: string, id: number): Parameter => {
  const p = makeParam(name, id);
  p.actif = true; // Actif par défaut car directement affiché
  return p;
};

/**
 * Factory to create a unified MessageBoxEntity.
 */
const createMessageBoxEntity = (index: number): MessageBoxEntity => {
  return {
    id: generateId(),
    index,
    name: `Message Box ${index}`,
    ui: {
      showTitle: false,
      showLine1: false,
      showLine2: false,
      showBtnLeft: false,
      showBtnRight: false,
    },
    title: createMsgParam("Title", index * 10 + 1),
    line1: createMsgParam("Ligne 1", index * 10 + 2),
    line2: createMsgParam("Ligne 2", index * 10 + 3),
    btnLeft: createMsgParam("Button left", index * 10 + 4),
    btnRight: createMsgParam("Button right", index * 10 + 5),
  };
};

/**
 * Persistent Master List.
 * Generates the requested 20 maximum message boxes upfront.
 */
export const messageBoxes = ref<MessageBoxEntity[]>(
  Array.from({ length: 20 }, (_, i) => createMessageBoxEntity(i + 1)),
);

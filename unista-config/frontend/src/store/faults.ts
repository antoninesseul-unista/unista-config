import { computed, ref } from "vue";
import type { FaultCategory, FaultGroup, Parameter } from "../types";
import { makeParam } from "../utils/helpers";
import { modules } from "./modules";

/**
 * Helper to generate a standardized Fault Parameter.
 */
const makeFault = (
  id: number,
  faultCode: string,
  severity: number,
  fr: string,
  en: string = "",
  de: string = "",
  es: string = "",
): Parameter => {
  const p = makeParam(fr || `Fault ${faultCode}`, id);
  p.faultCode = faultCode;
  p.severity = severity;
  p.commentFr = fr;
  p.commentEn = en;
  p.commentDe = de;
  p.commentEs = es;
  p.actif = true;
  return p;
};

const createGlobalSafetyCategories = (): FaultCategory[] => {
  // Emergency Stops (251)
  const estops = Array.from({ length: 40 }, (_, i) => {
    const id = i + 1;
    let fr = `Arret d'urgence ${id}`;
    let en = `Emergency Stop ${id}`;
    return makeFault(id, `1025001${id.toString().padStart(2, "0")}`, 1, fr, en);
  });

  // Doors (252)
  const doors = Array.from({ length: 40 }, (_, i) => {
    const id = i + 1;
    const fr = id <= 9 ? `Porte ${id} ouverte` : `Porte XX ouvertes`;
    const en = id <= 9 ? `Door ${id} opened` : `Door XX open`;
    return makeFault(id, `1025002${id.toString().padStart(2, "0")}`, 1, fr, en);
  });

  // Safety Functions (253)
  const safFuncs = Array.from({ length: 40 }, (_, i) => {
    const id = i + 1;
    const mapFr: any = {
      1: "LIGNE AU NON OK",
      2: "LIGNE DE PORTES OUVERTE",
      3: "ATTENTE RÉARMEMENT GÉNÉRAL MACHINE (AU)",
      4: "ATTENTE RÉARMEMENT GÉNÉRAL MACHINE (PORTES)",
      5: "ATTENTE RÉARMEMENT MACHINE MISE EN LOT (PORTES)",
      6: "ATTENTE RÉARMEMENT MACHINE PALETTISATION (PORTES)",
      7: "ATTENTE RÉARMEMENT PORTE 1",
      8: "ATTENTE RÉARMEMENT PORTE 2",
      9: "ATTENTE RÉARMEMENT PORTE 3",
      10: "ATTENTE RÉARMEMENT PORTE 4",
      11: "ATTENTE RÉARMEMENT PORTE 5",
      12: "ATTENTE RÉARMEMENT PORTE 6",
      13: "ATTENTE RÉARMEMENT PORTE 7",
    };
    const mapEn: any = {
      1: "ES LINE OPEN",
      2: "DOORS LINE OPEN",
      3: "WAITING POWER ON THE MACHINE (ES)",
      4: "WAITING POWER ON THE MACHINE (DOORS)",
    };
    return makeFault(
      id,
      `1025003${id.toString().padStart(2, "0")}`,
      1,
      mapFr[id] || "",
      mapEn[id] || "",
    );
  });

  // Safety Faults (254)
  const safFaults = Array.from({ length: 40 }, (_, i) => {
    const id = i + 1;
    const mapFr: any = {
      7: "Safety non démarrée",
      8: "Attente réarmement magasin rack",
    };
    const mapEn: any = {
      7: "Safety not started",
      8: "Wait Rearming Racks Store",
    };
    return makeFault(
      id,
      `1025004${id.toString().padStart(2, "0")}`,
      1,
      mapFr[id] || "",
      mapEn[id] || "",
    );
  });

  return [
    { name: "Emergency Stops (251)", ui: { show: false }, items: estops },
    { name: "Machine Access (252)", ui: { show: false }, items: doors },
    { name: "Safety Functions (253)", ui: { show: false }, items: safFuncs },
    { name: "Safety Faults (254)", ui: { show: false }, items: safFaults },
  ];
};

const createProcessCategories = (): FaultCategory[] => {
  // Type: [Fr, En, Severity]
  type FaultDef = [string, string, number];

  const umMap: Record<number, FaultDef> = {
    1: ["Défaut Alimentation 24Vdc", "Fault on 24Vdc", 1],
    2: ["Défaut Alimentation 24Vdc UPS", "Fault on 24Vdc UPS", 1],
    3: ["Manque Alimentation Air", "Air", 1],
    4: ["Erreur Bouton Stop", "Stop button error", 1],
    5: ["Attente machine amont", "Wait infeed machine", 4],
    6: ["Attente machine aval", "Wait outfeed machine", 4],
    7: ["Mode passe-travers", "Pass throught mode-active", 4],
    8: ["Mode à vide", "Without product mode active", 4],
    9: ["Mode vidange", "Emptying mode active", 4],
    10: ["Mode fin de production", "End of production", 4],
    11: ["Charger une recette", "Load Recipe", 4],
    12: ["Attente scan OF", "Wait OF scan", 2],
    13: [
      "OF non cohérent avec la recette choisie",
      "OF not coherent with the chosen recipe",
      2,
    ],
  };

  const emMaps: Record<number, Record<number, FaultDef>> = {};

  // Generate UM items
  const umItems = Array.from({ length: 40 }, (_, i) => {
    const id = i + 1;
    const def = umMap[id] || [
      `UM Défaut process ${id}`,
      `UM Process fault ${id}`,
      2,
    ];
    return makeFault(
      id,
      `020000${id.toString().padStart(2, "0")}`,
      def[2],
      def[0],
      def[1],
    );
  });

  const categories: FaultCategory[] = [
    { name: "UM Process Faults (EM0)", ui: { show: false }, items: umItems },
  ];

  // Generate EM1 to EM8 items dynamically
  for (let em = 1; em <= 8; em++) {
    const items = Array.from({ length: 40 }, (_, i) => {
      const id = i + 1;
      const def: FaultDef = (emMaps[em] && emMaps[em][id]) || [
        `EM${em} Défaut process ${id}`,
        `EM${em} Process fault ${id}`,
        2,
      ];
      const codeStr = `${em}20000${id.toString().padStart(2, "0")}`;
      return makeFault(id, codeStr, def[2], def[0], def[1]);
    });
    categories.push({
      name: `EM${em} Process Faults`,
      ui: { show: false },
      items,
    });
  }

  return categories;
};

const createEquipmentCategories = (): FaultCategory[] => {
  const eqMap = [
    {
      fam: "202",
      name: "Electrovalve",
      f: {
        1: "Commande d'avance et de recul en simultanée",
        2: "Timeout avance vérin",
        3: "Timeout arrière vérin",
        6: "Manque autorisation d'avance",
        7: "Manque autorisation de recul",
      },
    },
    {
      fam: "203",
      name: "Vacuum",
      f: {
        1: "Commande d' aspiration et soufflage simultanée",
        2: "Timeout aspiration",
        4: "Erreur de paramétrage",
        5: "Pièce lachée",
      },
    },
    {
      fam: "204",
      name: "DigInput",
      f: {
        1: "Autocontrôle à 0",
        2: "Autocontrôle à 1",
        4: "Entrée forcée à 0 sans autorisation",
      },
    },
    {
      fam: "208",
      name: "Axis",
      f: {
        1: "Erreur générale de l'axe",
        2: "Le variateur n'est pas prêt",
        5: "L'axe n'a pas d'origine, les mouvements ne sont pas possibles",
        11: "Limit de couple atteinte",
      },
    },
    {
      fam: "210",
      name: "Camera",
      f: {
        1: "Prise de vue interdite",
        3: "Erreur chargement programme caméra",
        5: "Caméra hors ligne",
        6: "Défaut caméra",
      },
    },
    {
      fam: "211",
      name: "Robot",
      f: {
        1: "Programme robot non démarré",
        2: "Perte communication robot",
        11: "Collision robot",
        12: "Robot en mode manuel",
        14: "Mode sans robot",
      },
    },
  ];

  return eqMap.map((eq) => {
    const items = Array.from({ length: 15 }, (_, i) => {
      const id = i + 1;
      const fr = (eq.f as any)[id] || `Défaut ${eq.name} ${id}`;
      return makeFault(
        id,
        `X${eq.fam}YYY${id.toString().padStart(2, "0")}`,
        2,
        fr,
      );
    });
    return {
      name: `${eq.name} Templates (${eq.fam})`,
      ui: { show: false },
      items,
    };
  });
};

/**
 * Master Pools (Preserve state)
 */
const safetyCategories = ref(createGlobalSafetyCategories());
const processCategories = ref(createProcessCategories());
const equipmentCategories = ref(createEquipmentCategories());

/**
 * Reactive Fault Groups for UI.
 * Automatically adapts the "Process" group to the currently active modules.
 */
export const faultGroups = computed<FaultGroup[]>(() => {
  const activeModIndexes = new Set(
    modules.value.filter((m) => m.enable).map((m) => m.index),
  );

  const activeProcessCats = processCategories.value.filter((cat) => {
    if (cat.name.startsWith("UM")) return true;

    const match = cat.name.match(/EM(\d+)/);
    if (match) {
      const emIdx = parseInt(match[1], 10);
      return activeModIndexes.has(emIdx);
    }
    return false;
  });

  return [
    {
      id: "safety",
      name: "Global Safety & Security",
      categories: safetyCategories.value,
    },
    {
      id: "process",
      name: "Machine & Process Faults",
      categories: activeProcessCats,
    },
    {
      id: "equipment",
      name: "Equipment Base Templates",
      categories: equipmentCategories.value,
    },
  ];
});

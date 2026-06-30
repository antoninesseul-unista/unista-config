<template>
  <div class="flex flex-col h-full p-8 bg-gray-50/50">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">
          Translations
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Glossary and multilingual translations mapping.
        </p>
      </div>

      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
        >
          <AppIcon name="search" :size="16" class="text-gray-400" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          class="block w-full py-2 pl-10 pr-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          placeholder="Search translation..."
        />
      </div>
    </div>

    <div
      class="flex-1 overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col"
    >
      <div class="overflow-auto h-full">
        <table class="w-full text-sm text-left whitespace-nowrap table-fixed">
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10 shadow-sm border-b border-gray-200"
          >
            <tr>
              <th
                v-for="col in columnsConfig"
                :key="col.id"
                scope="col"
                class="relative px-4 py-3 font-semibold bg-gray-50 border-r border-gray-200 last:border-r-0 select-none"
                :style="{
                  width: columnWidths[col.id] + 'px',
                  minWidth: columnWidths[col.id] + 'px',
                }"
              >
                {{ col.label }}

                <div
                  class="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-indigo-400 z-20 transition-colors"
                  @mousedown.prevent="startResize($event, col.id)"
                ></div>
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(row, index) in filteredTranslations"
              :key="index"
              class="hover:bg-indigo-50/30 transition-colors"
            >
              <td
                class="px-4 py-2 font-mono text-xs font-semibold text-indigo-600 bg-gray-50/50 border-r border-gray-100 truncate"
              >
                {{ row.id }}
              </td>

              <td class="px-1 py-1 border-r border-gray-100/50">
                <input
                  v-model="row.fr"
                  type="text"
                  class="w-full px-3 py-1.5 text-sm bg-transparent border border-transparent rounded hover:border-gray-300 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </td>
              <td class="px-1 py-1 border-r border-gray-100/50">
                <input
                  v-model="row.en"
                  type="text"
                  class="w-full px-3 py-1.5 text-sm bg-transparent border border-transparent rounded hover:border-gray-300 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </td>
              <td class="px-1 py-1 border-r border-gray-100/50">
                <input
                  v-model="row.de"
                  type="text"
                  class="w-full px-3 py-1.5 text-sm bg-transparent border border-transparent rounded hover:border-gray-300 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </td>
              <td class="px-1 py-1 border-r border-gray-100/50">
                <input
                  v-model="row.es"
                  type="text"
                  class="w-full px-3 py-1.5 text-sm bg-transparent border border-transparent rounded hover:border-gray-300 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </td>
              <td class="px-1 py-1 border-r border-gray-100/50">
                <input
                  v-model="row.it"
                  type="text"
                  class="w-full px-3 py-1.5 text-sm bg-transparent border border-transparent rounded hover:border-gray-300 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </td>
              <td class="px-1 py-1 border-r border-gray-100/50">
                <input
                  v-model="row.res1"
                  type="text"
                  class="w-full px-3 py-1.5 text-sm bg-transparent border border-transparent rounded hover:border-gray-300 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </td>
              <td class="px-1 py-1">
                <input
                  v-model="row.res2"
                  type="text"
                  class="w-full px-3 py-1.5 text-sm bg-transparent border border-transparent rounded hover:border-gray-300 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </td>
            </tr>

            <tr v-if="filteredTranslations.length === 0">
              <td
                colspan="8"
                class="px-4 py-8 text-center text-sm text-gray-500"
              >
                No translation found matching "{{ searchQuery }}"
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import AppIcon from "../components/AppIcon.vue";
import {
  translationsState as translations,
  TranslationRow,
} from "../core";

// Data state
const searchQuery = ref<string>("");

/**
 * Column configurations for rendering headers and managing widths
 */
const columnsConfig = [
  { id: "id", label: "Identifier" },
  { id: "fr", label: "Fr" },
  { id: "en", label: "En" },
  { id: "de", label: "De" },
  { id: "es", label: "Es" },
  { id: "it", label: "Italian" },
  { id: "res1", label: "Reserve 1" },
  { id: "res2", label: "Reserve 2" },
];

/**
 * Reactive state for column widths
 */
const columnWidths = ref<Record<string, number>>({
  id: 200,
  fr: 160,
  en: 160,
  de: 160,
  es: 160,
  it: 160,
  res1: 160,
  res2: 160,
});

// Resizing logic state
let activeResizeCol: string | null = null;
let startX = 0;
let startWidth = 0;

/**
 * Initiates the column resize event
 */
const startResize = (event: MouseEvent, colId: string) => {
  activeResizeCol = colId;
  startX = event.clientX;
  startWidth = columnWidths.value[colId];

  // Attach event listeners to window to ensure smooth dragging even if cursor leaves element
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);

  // Set global cursor to prevent flickering
  document.body.style.cursor = "col-resize";
  document.body.style.userSelect = "none"; // Prevent accidental text selection
};

/**
 * Handles the mouse drag to compute new width
 */
const onMouseMove = (event: MouseEvent) => {
  if (!activeResizeCol) return;
  const deltaX = event.clientX - startX;
  // Minimum width limit set to 60px to prevent layout breaking
  columnWidths.value[activeResizeCol] = Math.max(60, startWidth + deltaX);
};

/**
 * Cleans up resizing event listeners
 */
const onMouseUp = () => {
  activeResizeCol = null;
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);

  // Restore global cursor and selection
  document.body.style.cursor = "";
  document.body.style.userSelect = "";
};

// Cleanup listeners if component is destroyed while dragging
onUnmounted(() => {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
});

/**
 * Raw TSV text containing default translations
 */
const rawTranslations = `TRANSLATIONS	Fr	En	De	Es	Italian	Reserve1	Reserve2

ELECTROVALVE	CYLINDER	ZYLINDER	CILINDRO	CILINDRO
EvFwdDelay	Durée d'avance	Time forward	Zeit nach vorne	Tiempo hacia adelante	Tempo in avanti
EvBwdDelay	Durée de recul	Time backward	Zeit rückwärts	Tiempo de retroceso	Tempo all'indietro
EvFwdAnticipation	Anticipation avance	Forward anticipation	Zeitüberschreitung vorwärts	Tiempo de espera hacia adelante	Timeout in avanti
EvBwdAnticipation	Anticipation recul	Backward anticipation	Auszeit nach hinten	Yiempo de espera hacia atras	Timeout all'indietro

WAKUUM	SUASPIRACION	ASPIRAZIONE
VacVacFilter	Durée filtre vaccuostat	Vaccum switch filter	Impfschalterfilter	Filtro de interruptor de vacío	Filtro dell'interruttore a vasto
VacVacDelay	Durée validation aspiration	Vaccum validation time	Impfzeit Validierungszei	Tiempo de validación de vacunas	Tempo di convalida del vaccino
VacVacTimeout	Timeout aspiration	Vaccum timeout	Imaccum -Zeitüberschreitung	Tiempo de espera de vacunas	Timeout del vaccino
VacBlowDuration	Durée de soufflage	Blowing duration	Blasendauer	Duración de soplado	Durata soffiante
VacAnticipationVac	Durée anticipation aspiration	Vaccum anticipation duration	Vaccum -Vorfreudedauer	Duración de anticipación de vacunas	Durata dell'anticipazione del vaccumi
VacAnticipationBlow	Durée anticipation soufflage	Blowing anticipation duration	Erwartungsdauer blasen	Soplando duración de anticipación	Soffiando la durata dell'anticipazione
VacAnticipationStopVac	Durée anticipation arret	Stop anticipation duration	ntizipationsdauer stoppen	Detener la duración de la anticipación	Fermare la durata dell'anticipazione

CAPTEUR TOR	DIGIT INPUT	AON SENSOREN	SENSORES TOR	SENSORES DIGITALE
DigInFilterOn	Filtre à on	Filter on	TONNE	TONELADA	TONNELLATA
DigInFilterOff	Filtre à off	Filter off	Toff	PETIMETRE	Toff
DigInTimeoutTestOn	Durée maximum du filtre à on	Maximum timeout filter on	Ton Timeout	Tiempo de espera de tonelada	Ton timeout
DigInTimeoutTestOff	Durée maximum du filtre à off	Maximum timeout filter off	Toff Timeout	Tiempo de espera de Toff	Timeout toff

CAPTEUR ANALOGIQUE	ANALOGE SENSORED	SENSORES ANA	SENSORE ANALOGICO
AnaInThresholdLow	Niveau défaut haut	Fault high level	Fehler hoher Niveau	Falla de alto nivel	Livello di alto livello
AnaInThresholdHigh	Niveau alarme haute	Alarm high level	Alarm hoher Niveau	Alarma de alto nivel	Allarme alto livello
AnaInLowAlarmLevel	Niveau alarame bas	Alarm low level	Alarm niedrig	Alarma de nivel bajo	Allarme basso livello
AnaInLowFaultLevel	Niveau defaut bas	Fault low level	Fehler niedriger Pegel	Falla de nivel bajo	Livello basso
AnaInHighAlarmLevel	Consigne Haute	High setpoint	Hoher Sollwert	Punto de ajuste alto	Setpoint elevato
AnaInHighFaultLevel	Consigne basse	Low setpoint	Niedriger Sollwert	Punto de ajuste bajo	Consigne basse

SORTIE ANALOGIQUE	ANALOG OUTPUT	ANALOG OUTPUT	SALIDA ANALOGICA	USCITA ANALOGICA
AnaOutThresholdMin	Seuil mini	Threshold min	Schwelle min	Umbral min	Soglia min
AnaOutThresholdMax	Seuil maxi	Threshold max	Schwelle Max	Umbral máximo	oglia max
AnaOutThreshold1	Seuil 1	Threshold 1	Schwelle 1	Umbral 1	Soglia 1
AnaOutThreshold2	Seuil 2	Threshold 2	Schwelle 2	Umbral 2	Soglia 2
AnaOutThreshold3	Seuil 3	Threshold 3	Schwelle 3	Umbral 3	Soglia 3
AnaOutThreshold4	Seuil 4	Threshold 4	Schwelle 4	Umbral 4	Soglia 4
AnaOutThreshold5	Seuil 5	Threshold 5	Schwelle 5	Umbral 5	Soglia 5
AnaOutThreshold6	Seuil 6	Threshold 6	Schwelle 6	Umbral 6	Soglia 6

CAMERA	CAMERA	KAMERA	CAMARA	TELECAMERA
CamRecipeName	Nom du programme	Program name	Programmname	Nombre del programa	Nome del programma
CamExposureTime	Temps d'exposition	Exposition time	Ausstellungszeit	Tiempo de exposición	Tempo di esposizione
CamNbParts	Nombre de pièce à chercher	Parts number to find	eilenummer zu finden	Número de piezas para encontrar	Numero di parti da trovare
CamScoreA	Score sens A	Direction A result	Richtung ein Ergebnis	Dirección un resultado	Direzione un risultato
CamScoreB	Score sens B	Direction B result	Richtung B Ergebnis	Resultado de la dirección B	Risultato della direzione B
CamAsymmetricParts	Pièce assymétrique	Asymetric part	symetrischer Teil	Parte asimétrica	Parte asimetrica

AXE	AXIS	ASSE
AxisTorqueMax	Couple maximum	Torque limit	Drehmomentgrenze	Límite de par	imite di coppia
AxisPointPosAbsolute	Position absolue	Absolute position	Abgeschafft	osición aboluta<	Posizione aboluta
AxisPointPosRelative	Position relataive	Relative position	Relative Position	Posición relativa	Posizione relativa
AxisPointAcceleration	Accélération	Acceleration	Beschleunigung	Aceleración	Accelerazione
AxisPointDeceleration	Deccélération	Deceleration	Verzögerung	Desaceleración	Decelerazione
AxisPointVelocity	Vitesse	Speed	Geschwindigkeit	Velocidad	Velocità
AxisPointTorque	Consigne de couple	Set torque	Drehmoment setzen	Par de pares	Imposta coppia
AxisPointJerk	Jerk	Jerk	Ruck	Idiota	Sbalzo

ROBOT	ROBOT	ROBOTER	ROBOT	ROBOT
RobotGeneralVelocity	Vitesse globale	Global speed	Globale Geschwindigkeit	Velocidad global	Velocità globale
RobotBackVelocity	Vitesse de repli	Rollback speed	Rollback -Geschwindigkeit	Velocidad de reversión	Velocità di rollback
RobotEmptyVelocity	Vitesse à vide	Empty speed	Leere Geschwindigkeit	Velocidad vacía	Velocità vuota
RobotFullVelocity	Vitesse à plein	Full speed	Vollgas	A toda velocidad	Piena velocità
RobotEmptyAcceleration	Accélération à vide	Empty acceleration	Leere Beschleunigung	Aceleración vacía	Accelerazione vuota
RobotFullAcceleration	Accélération à plein	Full acceleration	Vollbeschleunigung	Aceleración completa	Piena accelerazione
RobotStartTracking1	Début de travail tracking 1	Begin work Tracking 1		Comience a trabajar rastreando 1	Inizia il monitoraggio del lavoro 1
RobotStartConvTracking1	Départ convoyeur 1	Start conveyor tracking 1		Comience el seguimiento del transportador 1	Inizia il trasporto di trasporto 1
RobotStopTracking1	Arret convoyeur 1	Stop conveyor tracking 1	Stop Förderer verfolgt 1	Detener el seguimiento del transportador 1	Smettere di monitorare il trasportatore 1
RobotStopConvTracking1	Fin de travail tracking 1	End work tracking 1	Endarbeit verfolgt 1	Final Work Tracking 1	>End Work Tracking 1
RobotStartTracking2	Début de travail tracking 2	Begin work Tracking 2	>Beginnen Sie mit der Arbeit mit der Tracking 2	Comience a trabajar rastreando 2	Inizia il monitoraggio del lavoro 2
RobotStartConvTracking2	Départ convoyeur 2	Start conveyor tracking 2	Start Förderer Tracking 2	Iniciar el seguimiento del transportador 2	Inizia il trasporto di trasporto 2
RobotStopTracking2	Arret convoyeur 2	Stop conveyor tracking 2	Stopp -Förderer -Tracking 2	Detener el seguimiento del transportador 2	Smettere di monitorare il trasporto 2
RobotStopConvTracking2	Fin de travail tracking 2	End work tracking 2	Endarbeit Tracking 2	Final Work Tracking 2	End Work Tracking 2
FilePaletization	Nom fichier de palettisation	Palletization filename	Palletisierungsmateiname	Nombre de archivo de paletización	Palletizzazione

FONCTION	FUNCTION	FUNKTION	FUNCION	FUNZIONE
PRODUIT	PRODUCT	PRODUKT	PRODUCTO	PRODOTTO
PROCESS	PROCESS	VERFAHREN	PROCESO	PROCESSO
REGLAGE	CHECKLIST	EINSTELLUNG	CONFIGURACIÓN	COLLOCAMENTO

MENUS ET BOUTONS
START	START	START	PARTIDA	INIZIO
STOP	STOP	STOPPEN	DETENER	FERMARE
RAZ	RESET	ZURÜCKSETZEN	REINICIAR	RESET
PRODUCTION	PRODUCTION	PRODUKTION	PRODUCCIÓN	PRODUZIONE
REGLAGE	SETTING	EINSTELLUNG	CONFIGURACIÓN	COLLOCAMENTO
MAINTENANCE	MAINTENANCE	WARTUNG	MANTENIMIENTO	MANUTENZIONE
QUALITÉ	QUALITY	QUALITÄT	CALIDAD	QUALITÀ
ADMIN	ADMIN	ADMIN	ADMINISTRACIÓN	AMMINISTRATORE
PERFORMANCE	PERFORMANCE	LEISTUNG	RENDIMIENTO	PRESTAZIONE
CYCLES	CYCLE	ZYKLUS	CICLO	CICLO
MODE DE MARCHE	WALK MODE	GEHMODUS	MODO MARCHA	MODALITÀ CAMMINATA
DONNÉES EXTERNES	EXTERNAL DATA	EXTERNE DATEN	DATOS EXTERNOS	DATI ESTERNI
PALETTISATION	PALLETIZING	PALETTIERUNG	PALETIZADO	PALLETTIZZAZIONE
COMPTEURS	COUNTER	ZÄHLER	CONTADORES	CONTATORE
HISTORIQUE ALARME	ALARM HISTORY	ALARMVERLAUF	HISTORIAL DE ALARMAS	CRONOLOGIA ALLARMI
AUDIT	AUDIT	PRÜFUNG	AUDITORÍA	VERIFICA
UTILISATEUR	USER	BENUTZER	USUARIO	UTENTE
ÉQUIPEMENT	EQUIPMENT	AUSRÜSTUNG	EQUIPO	ATTREZZATURA
AFFICHAGE	DISPLAY	ANZEIGE	PANTALLA	DISPLAY`;

/**
 * Parses raw text on initialization ONLY if the store is empty
 */
const parseTranslations = () => {
  // CRITICAL CHECK: Do not overwrite data if the store was already hydrated from disk
  if (translations.value && translations.value.length > 0) {
    return;
  }

  const lines = rawTranslations.split("\n");
  const parsedData: TranslationRow[] = [];

  for (const line of lines) {
    const trimmedLine = line.trimEnd();
    if (!trimmedLine) continue;

    const columns = trimmedLine.split("\t");

    // Skip headers and section titles
    if (columns[0] === "TRANSLATIONS" || columns.length < 2) continue;

    parsedData.push({
      id: columns[0]?.trim() || "",
      fr: columns[1]?.trim() || "",
      en: columns[2]?.trim() || "",
      de: columns[3]?.trim() || "",
      es: columns[4]?.trim() || "",
      it: columns[5]?.trim() || "",
      res1: columns[6]?.trim() || "",
      res2: columns[7]?.trim() || "",
    });
  }

  translations.value = parsedData;
};

/**
 * Filter mechanism to search across all columns dynamically
 */
const filteredTranslations = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return translations.value;

  return translations.value.filter((row) => {
    return Object.values(row).some((value) =>
      String(value).toLowerCase().includes(query),
    );
  });
});

onMounted(() => {
  parseTranslations();
});
</script>

<!-- <style scoped>
/* Clean, subtle scrollbar design */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>

<style scoped>
/* Clean, subtle scrollbar design */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style> -->

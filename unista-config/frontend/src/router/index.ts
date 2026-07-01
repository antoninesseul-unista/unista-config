import { createRouter, createWebHashHistory } from "vue-router";
import { equipmentRegistry, pageRegistry } from "../core/registry";

import CFR21Config from "../views/CFR21Config.vue";
import CountersView from "../views/CountersView.vue";
import CycleButtonsView from "../views/CycleButtonsView.vue";
import FaultsView from "../views/FaultsView.vue";
import GeneralConfig from "../views/GeneralConfig.vue";
import GenericEquipmentView from "../views/GenericEquipmentView.vue";
import GenericPageView from "../views/GenericPageView.vue";
import MachineLogicView from "../views/MachineLogicView.vue"; // Nouvel import
import MessageBoxView from "../views/MessageBoxView.vue";
import ModuleView from "../views/Module.vue";
import ProcessButtonsView from "../views/ProcessButtonsView.vue";
import RoleManagement from "../views/RoleManagement.vue";
import SystemConstantsView from "../views/SystemConstantsView.vue";
import TranslationView from "../views/TranslationView.vue";
import UpdaterView from "../views/UpdaterView.vue";

const APP_TITLE = "Unista Config";

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", redirect: "/general" },

    {
      path: "/general",
      name: "general",
      component: GeneralConfig,
      meta: { title: "General" },
    },
    {
      path: "/system-constants",
      name: "systemConstants",
      component: SystemConstantsView,
      meta: { title: "System Limits" },
    },
    {
      path: "/translations",
      name: "translations",
      component: TranslationView,
      meta: { title: "Translations" },
    },
    {
      path: "/faults",
      name: "faults",
      component: FaultsView,
      meta: { title: "Alarms & Faults" },
    },
    {
      path: "/cfr21",
      name: "cfr21",
      component: CFR21Config,
      meta: { title: "CFR21 Security" },
    },
    {
      path: "/roles",
      name: "roles",
      component: RoleManagement,
      meta: { title: "Role Management" },
    },
    {
      path: "/updates",
      name: "updates",
      component: UpdaterView,
      meta: { title: "System Updates" },
    },
    {
      path: "/module",
      name: "module",
      component: ModuleView,
      meta: { title: "Modules" },
    },
    {
      path: "/process-buttons",
      name: "processButtons",
      component: ProcessButtonsView,
      meta: { title: "Process Buttons" },
    },
    {
      path: "/cycle-buttons",
      name: "cycleButtons",
      component: CycleButtonsView,
      meta: { title: "Cycle Buttons" },
    },
    {
      path: "/counters",
      name: "counters",
      component: CountersView,
      meta: { title: "Counters & Cadences" },
    },
    {
      path: "/message-box",
      name: "messageBox",
      component: MessageBoxView,
      meta: { title: "Message Boxes" },
    },
    {
      path: "/machine-logic",
      name: "machineLogic",
      component: MachineLogicView,
      meta: { title: "Machine Logic" },
    },
    {
      path: "/pages/:type",
      name: "page",
      component: GenericPageView,
      props: (route) => ({ type: route.params.type }),
      beforeEnter: (to) => {
        const t = String(to.params.type);
        // Protection des singletons
        if (["process", "setting", "info"].includes(t)) {
          return "/machine-logic";
        }
        return pageRegistry.value[t] ? true : "/general";
      },
      meta: { title: "Page" },
    },
    {
      path: "/equipment/:type",
      name: "equipment",
      component: GenericEquipmentView,
      props: (route) => ({ type: route.params.type }),
      beforeEnter: (to) =>
        equipmentRegistry.value[String(to.params.type)] ? true : "/general",
      meta: { title: "Equipment" },
    },

    { path: "/:pathMatch(.*)*", redirect: "/general" },
  ],
});

router.afterEach((to) => {
  const t = String(to.meta?.title || "").trim();
  document.title = t ? `${t} — ${APP_TITLE}` : APP_TITLE;
});

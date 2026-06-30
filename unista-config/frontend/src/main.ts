import "./style.css";
import { initRegistries } from "./core/registry";

async function bootstrap() {
  await initRegistries();

  const { createApp } = await import("vue");
  const { default: App } = await import("./App.vue");
  const { router } = await import("./router");
  const { initAutoSave } = await import("./core/bootstrap");

  initAutoSave();
  createApp(App).use(router).mount("#app");
}

bootstrap().catch((err) => {
  console.error("Failed to start application:", err);
});

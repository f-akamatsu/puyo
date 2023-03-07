import { createRouter, createWebHistory } from "vue-router";
import EditorPage from "@/components/pages/EditorPage.vue";
import TokopuyoPage from "@/components/pages/TokopuyoPage.vue";
import NazotokiPage from "@/components/pages/NazotokiPage.vue";

const routes = [
  { path: "/", redirect: "/editor" },
  { path: "/editor", component: EditorPage },
  { path: "/tokopuyo", component: TokopuyoPage },
  { path: "/nazotoki", component: NazotokiPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
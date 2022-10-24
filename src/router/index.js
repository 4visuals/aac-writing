import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import LevelView from "../views/level/LevelView.vue";
import BookShelfView from "../views/book/BookShelfView.vue";
import { PolicyWrapper, PolicyView } from "../components/policy";
import { QuizView } from "../views/quiz";
import { logger } from "@/service/util";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/level",
    name: "LevelView",
    component: LevelView,
  },
  {
    path: "/book",
    name: "BookShelfView",
    component: BookShelfView,
  },
  {
    path: "/quiz/:seq",
    name: "QuizView",
    props: true,
    component: QuizView,
  },
  {
    path: "/console",
    name: "AdminConsole",
    component: () =>
      import(
        /* webpackChunkName: "admin-module" */ "../spa/admin/AdminPage.vue"
      ),
  },
  {
    path: "/policy",
    name: "PolicyWrapper",
    component: PolicyWrapper,
    children: [
      {
        path: "tou",
        name: "TermsOfUse",
        component: PolicyView,
      },
      {
        path: "privacy",
        name: "PrivacyView",
        component: PolicyView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from) => {
  logger.log(`[${from.path}] -> [${to.path}]`);
  // if (from.name && to.fullPath === "/") {
  //   const exit = confirm("앱을 종료합니까?");
  //   return exit;
  // } else {
  //   return true;
  // }
});

export default router;

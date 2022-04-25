import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import LevelView from "../views/level/LevelView.vue";
import BookShelfView from "../views/book/BookShelfView.vue";
import { QuizView } from "../views/quiz";

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
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from) => {
  console.log(`[${from.path}] -> [${to.path}]`);
  if (from.name && to.fullPath === "/") {
    const exit = confirm("앱을 종료합니까?");
    return exit;
  } else {
    return true;
  }
});

export default router;

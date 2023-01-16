import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import LevelView from "../views/level/LevelView.vue";
import BookShelfView from "../views/book/BookShelfView.vue";
import { PolicyWrapper, PolicyView } from "../components/policy";
import LoginPage from "../views/LoginPage.vue";
import JoinPage from "../views/JoinPage.vue";
import { QuizView } from "../views/quiz";
import SupportPage from "../views/SupportPage.vue";
import {
  PurchaseWrapper,
  ProductListView,
  OrderFormView,
  OrderValidationView,
} from "../views/purchase";
import SettingPage from "../views/user/setting/SettingPage.vue";
import {
  SettingOverview,
  SettingAccount,
  SettingLicense,
  SettingStudent,
  SettingOrder,
} from "../views/user/setting/viewport";
import { logger } from "@/service/util";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/join",
    name: "JoinView",
    component: JoinPage,
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
    path: "/support",
    name: "SupportPage",
    component: SupportPage,
  },
  {
    path: "/purchase",
    name: "PurchaseWrapper",
    component: PurchaseWrapper,
    children: [
      {
        path: "",
        name: "ProductListView",
        component: ProductListView,
      },
      {
        path: "order/:code",
        name: "OrderFormView",
        component: OrderFormView,
      },
      {
        path: "order/checking",
        name: "OrderValidationView",
        component: OrderValidationView,
      },
    ],
  },
  {
    path: "/setting",
    name: "SettingPage",
    component: SettingPage,
    children: [
      {
        path: "",
        name: "SettingOverview",
        component: SettingOverview,
      },
      {
        path: "account",
        name: "SettingAccount",
        component: SettingAccount,
      },
      {
        path: "license",
        name: "SettingLicense",
        component: SettingLicense,
      },
      {
        path: "student",
        name: "SettingStudent",
        component: SettingStudent,
      },
      {
        path: "order",
        name: "SettingOrder",
        component: SettingOrder,
      },
    ],
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
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
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

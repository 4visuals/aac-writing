import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import LevelView from "../views/level/LevelView.vue";
import LevelListingView from "../views/level/LevelListingView.vue";
import SectionView from "../views/level/SectionView.vue";
import BookShelfView from "../views/book/BookShelfView.vue";
import BookListingView from "../views/book/BookListingView.vue";
import BookSectionView from "../views/book/BookSectionView.vue";
import { StudentStatWrapper } from "../views/stat";
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
  GroupOrderFormView,
} from "../views/purchase";
import SettingPage from "../views/user/setting/SettingPage.vue";
import {
  SettingOverview,
  SettingAccount,
  SettingLicense,
  SettingStudent,
  SettingOrder,
} from "../views/user/setting/viewport";

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
    children: [
      { path: "", name: "LevelListingView", component: LevelListingView },
      {
        path: "section/:sectionSeq",
        name: "LevelSectionView",
        component: SectionView,
      },
    ],
  },
  {
    path: "/book",
    name: "BookShelfView",
    component: BookShelfView,
    children: [
      { path: "", name: "BookListingView", component: BookListingView },
      {
        path: "section/:sectionSeq",
        name: "BookSectionView",
        component: BookSectionView,
      },
    ],
  },
  {
    path: "/stat",
    name: "StudentStatWrapper",
    component: StudentStatWrapper,
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
    children: [
      {
        path: "grouporder",
        component: () =>
          import(
            /* webpackChunkName: "admin-module" */ "../spa/admin/views/GroupOrderView.vue"
          ),
      },
    ],
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
      {
        path: "contact",
        name: "GroupOrderFormView",
        component: GroupOrderFormView,
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

export default router;

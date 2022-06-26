import { createStore } from "vuex";
import user from "./modules/user";
import course from "./modules/course";
import ui from "./modules/ui";
import exam from "./modules/exam";
import config from "./modules/app-config";

const store = createStore({
  modules: { user, course, ui, exam, config },
});

store.commit("exam/initLicense");
export default store;

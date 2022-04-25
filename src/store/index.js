import { createStore } from "vuex";
import user from "./modules/user";
import course from "./modules/course";
import ui from "./modules/ui";
import exam from "./modules/exam";

const store = createStore({
  modules: { user, course, ui, exam },
});

store.commit("exam/initLicense");
export default store;

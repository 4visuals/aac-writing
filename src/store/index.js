import { createStore } from "vuex";
import user from "./modules/user";
import course from "./modules/course";
import ui from "./modules/ui";

export default createStore({
  modules: { user, course, ui },
});

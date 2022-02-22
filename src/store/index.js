import { createStore } from "vuex";
import course from "./modules/dictation";
import ui from "./modules/ui";

export default createStore({
  modules: { course, ui },
});

import { createStore } from "vuex";
import user from "./modules/user";
import course from "./modules/course";
import ui from "./modules/ui";
import exam from "./modules/exam";
import config from "./modules/app-config";
import quizHistory from "../dao/quiz-history-store";

console.log("done!!!!!!!!");

const store = createStore({
  modules: { user, course, ui, exam, config, quizHistory },
});

store.commit("exam/initLicense");

export default store;

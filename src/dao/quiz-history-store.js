import { liveQuery } from "dexie";
import { quizDao } from "./";

const register = (store) => {
  const observable = liveQuery(() => quizDao.findBy());
  observable.subscribe({
    next: (res) => {
      store.commit("quizHistory/flush", res);
    },
  });

  store.registerModule("quizHistory", {
    namespaced: true,
    state: () => ({ done: true, histories: [] }),
    getters: {
      hasHistory: (state) => (section) => {
        const histories = state.histories.filter(
          (h) => h.sectionSeq === section.seq
        );
        return histories.length > 0;
      },
    },
    mutations: {
      flush(state, res) {
        state.histories = res;
      },
    },
  });
};

export default {
  register,
};

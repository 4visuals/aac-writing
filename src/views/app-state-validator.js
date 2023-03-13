import { useStore } from "vuex";
/**
 * local storage에 저장된 license가 없어질 수가 있나..
 *
 * @param {router: Router} args
 */
const checkAppState = ({ router }) => {
  const store = useStore();
  store.dispatch("exam/loadLicense").then((license) => {
    if (!license) {
      router.replace({ path: "/" });
    }
  });
};
export { checkAppState };

import api from "@/service/api";
import storage from "@/service/storage";

const installLoginData = (store, { membership, licenses, jwt }) => {
  membership.licenses = licenses;
  store.commit("setMembership", membership);
  store.commit("updateJwt", jwt);
  if (store.getters.isStudent) {
    store.commit("exam/setActiveLicense", licenses[0], { root: true });
  }
  return membership;
};
export default {
  namespaced: true,
  state: () => ({ membership: null, jwt: null, welcome: false }),
  getters: {
    oauthed: (state) => state.membership && state.membership.profile,
    currentUser: (state) => state.membership?.user,
    isMember: (state) => state.membership && state.membership.user,
    isTeacher: (state) => {
      const mm = state.membership;
      return mm && mm.user && mm.user.role === "TEACHER";
    },
    isStudent: (state) => {
      return state.membership?.user?.role === "STUDENT";
      // return mm && mm.user && mm.user.role === 'STUDENT'
    },
    students: (state, getters) => {
      const mm = state.membership;
      if (getters.isTeacher) {
        return mm.user.students;
      } else if (getters.isStudent) {
        return [mm.user];
      } else {
        return [];
      }
    },
  },
  mutations: {
    setMembership(state, membership) {
      membership.image = membership.profile.picture;
      state.membership = membership;
    },
    clearMembership(state) {
      state.membership = null;
    },
    showWelcome(state) {
      state.welcome = true;
    },
    updateJwt(state, jwt) {
      state.jwt = jwt;
      storage.local.write("aac_jwt_token", jwt);
    },
    initUser(state) {
      const jwt = storage.local.read("aac_jwt_token", null);
      state.jwt = jwt;
      // if (location.host.startsWith("10.138") && !state.jwt) {
      //   // mobile test
      //   state.jwt =
      //     "";
      // }
      return jwt;
    },
    applyStudent(state, args) {
      const { student, license } = args;
      const mm = state.membership;
      mm.user.students.push(student);
      license.studentRef = student.seq;
    },
  },

  actions: {
    autoLogin(ctx) {
      ctx.commit("initUser");
      if (ctx.state.jwt) {
        return api.user.login().then((res) => {
          const { licenses } = res;
          res.membership.licenses = licenses;
          ctx.commit("setMembership", res.membership);
          ctx.commit("updateJwt", res.jwt);
          if (ctx.getters.isStudent) {
            ctx.commit("exam/setActiveLicense", licenses[0], { root: true });
          }
        });
      }
    },
    /**
     *
     * @param {*} ctx
     * @param {{vendor, type: '토큰유형', token: '토큰 문자열'}} args
     * @returns
     */
    checkMembership(ctx, args) {
      return api.user
        .membership(args.vendor, args.type, args.token)
        .then((res) => {
          // res.membership.licenses = res.licenses;
          // ctx.commit("setMembership", res.membership);
          // ctx.commit("updateJwt", res.jwt);
          // return res.membership;
          return installLoginData(ctx, res);
        });
    },
    loginStudent(ctx, args) {
      return api.student.login(args.id, args.password).then((res) => {
        // res.membership.licenses = res.licenses;
        // ctx.commit("setMembership", res.membership);
        // ctx.commit("updateJwt", res.jwt);
        // if (ctx.getters.isStudent) {
        //   ctx.commit("exam/setActiveLicense", res.licenses[0], { root: true });
        // }
        // return res;
        return installLoginData(ctx, res);
      });
    },
    join(ctx) {
      return api.user.join().then((res) => {
        ctx.commit("showWelcome");
        // res.membership.licenses = res.licenses;
        // ctx.commit("setMembership", res.membership);
        // ctx.commit("updateJwt", res.jwt);
        // return res.membership;
        return installLoginData(ctx, res);
      });
    },
    createStudent(ctx, args) {
      const { name, birthday, password, license } = args;
      return api.student
        .register(name, birthday, password, license?.uuid)
        .then((res) => {
          console.log(res);
          ctx.commit("applyStudent", { student: res.student, license });
          return res;
        })
        .catch((err) => {
          alert("학생 추가 실패: " + err.cause);
        });
    },
    bindStudent(ctx, args) {
      const { license, student } = args;
      return api.license.bind(license.seq, student.seq);
    },
  },
};

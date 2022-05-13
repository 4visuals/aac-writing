import api from "@/service/api";
import storage from "@/service/storage";

export default {
  namespaced: true,
  state: () => ({ membership: null, jwt: null, welcome: false }),
  getters: {
    oauthed: (state) => state.membership && state.membership.profile,
    isMember: (state) => state.membership && state.membership.user,
    isTeacher: (state) => {
      const mm = state.membership;
      return mm && mm.user && mm.user.role === "TEACHER";
    },
    students: (state, getters) => {
      const mm = state.membership;
      if (getters.isTeacher) {
        return mm.user.students;
      } else {
        return [];
      }
    },
    // assignee: (state) => (lcsSeq) => {
    //   const license = state.membership.licenses.find(lcs => lcs.seq = licsSeq);
    //   return license.
    // }
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
          res.membership.licenses = res.licenses;
          ctx.commit("setMembership", res.membership);
          ctx.commit("updateJwt", res.jwt);
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
          res.membership.licenses = res.licenses;
          ctx.commit("setMembership", res.membership);
          ctx.commit("updateJwt", res.jwt);
          return res.membership;
        });
    },
    join(ctx) {
      return api.user.join().then((res) => {
        res.membership.licenses = res.licenses;
        ctx.commit("setMembership", res.membership);
        ctx.commit("updateJwt", res.jwt);
        ctx.commit("showWelcome");
        return res.membership;
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

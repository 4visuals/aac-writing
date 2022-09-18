import env from "@/service/env";
import api from "@/service/api";
import storage from "@/service/storage";
import { time } from "@/service/util";
const installLoginData = (store, { membership, licenses, jwt, segments }) => {
  membership.licenses = licenses;
  store.commit("setMembership", membership);
  store.commit("updateJwt", jwt);
  if (store.getters.isStudent) {
    store.commit("exam/setActiveLicense", licenses[0], { root: true });
    store.commit("exam/setSegmentHistories", segments, { root: true });
  } else if (store.getters.isTeacher) {
    store.getters.students.forEach((student) => {
      student.userId = student.userId || null;
      student.birth = time.birthToDate(student.birth);
    });
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
      let jwt = storage.local.read("aac_jwt_token", null);
      state.jwt = jwt;
      if (
        env.MODE === "DEVELOPMENT" &&
        location.host.startsWith("192.168.") &&
        !state.jwt
      ) {
        // mobile test
        state.jwt = jwt = env.JWT_TOKEN;
      }
      return jwt;
    },
    logoutUser(state) {
      state.jwt = null;
      storage.local.remove("aac_jwt_token");
      this.commit("user/clearMembership");
    },
    applyStudent(state, args) {
      const { student, license } = args;
      student.birth = time.birthToDate(student.birth);
      const mm = state.membership;
      mm.user.students.push(student);
      license.studentRef = student.seq;
    },
    updateStudent(state, student) {
      student.birth = time.birthToDate(student.birth);
      const { students } = state.membership.user;
      const pos = students.findIndex((stud) => stud.seq === student.seq);
      students[pos] = student;
      state.membership.user.students = [...students];
    },
  },

  actions: {
    autoLogin(ctx) {
      ctx.commit("initUser");
      if (ctx.state.jwt) {
        return api.user
          .login()
          .then((res) => {
            return installLoginData(ctx, res);
          })
          .catch((e) => {
            ctx.commit("logoutUser");
            throw e;
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
          return installLoginData(ctx, res);
        });
    },
    loginStudent(ctx, args) {
      return api.student.login(args.id, args.password).then((res) => {
        return installLoginData(ctx, res);
      });
    },
    join(ctx) {
      return api.user.join().then((res) => {
        ctx.commit("showWelcome");
        return installLoginData(ctx, res);
      });
    },
    createStudent(ctx, args) {
      const { name, birth, userId, pass, license } = args;
      return api.student
        .register(name, birth, userId, pass, license?.uuid)
        .then((res) => {
          console.log(res);
          ctx.commit("applyStudent", { student: res.student, license });
          return res;
        });
    },
    updateStudent(ctx, args) {
      const { student, props } = args;
      props.seq = student.seq;
      return api.student.update(student.seq, props).then((res) => {
        args.user = args.student;
        ctx.commit("updateStudent", res.student);
      });
    },
    bindStudent(ctx, args) {
      const { license, student } = args;
      return api.license.bind(license.seq, student.seq);
    },
  },
};

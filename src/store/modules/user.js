import env from "@/service/env";
import api from "@/service/api";
import storage from "@/service/storage";
import { time } from "@/service/util";
import License from "@/entity/license";

const installLoginData = (
  store,
  { membership, licenses, jwt, segments, records }
) => {
  licenses.forEach((lcs) => (lcs.isNew = false));
  membership.licenses = licenses.map((lcs) => new License(lcs));
  store.commit("setMembership", membership);
  store.commit("updateJwt", jwt);
  if (store.getters.isStudent) {
    store.commit("exam/setActiveLicense", licenses[0], { root: true });
    store.commit("exam/setSegmentHistories", segments, { root: true });
  } else if (store.getters.isTeacher) {
    store.getters.students.forEach((student) => {
      student.userId = student.userId || null;
      const ymd = student.birth.split("-");
      student.birth = time.birthToDate(ymd);
    });
  }

  if (records) {
    store.commit(
      "record/updateRecord",
      { records, clear: true },
      { root: true }
    );
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
    enrolledStudents: (state, getters) => {
      const { students } = getters;
      const { licenses } = state.membership;
      return licenses
        .filter((lcs) => !lcs.isExpired())
        .map((lcs) => students.find((stud) => lcs.studentRef === stud.seq));
    },
    unregisterdStudents: (state, getters) => {
      const { students, enrolledStudents } = getters;
      return students.filter((stud) => !enrolledStudents.includes(stud));
    },
  },
  mutations: {
    setMembership(state, membership) {
      membership.image = membership.profile.picture;
      state.membership = membership;
    },
    addLicenses(state, licenses) {
      licenses.forEach((lcs) => (lcs.isNew = true));
      state.membership.licenses.push(
        ...licenses.map((lcs) => new License(lcs))
      );
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
      const ymd = student.birth.split("-");
      student.birth = time.birthToDate(ymd);
      const mm = state.membership;
      mm.user.students.push(student);
      if (license) {
        license.studentRef = student.seq;
      }
    },
    updateStudent(state, student) {
      const ymd = student.birth.split("-");
      student.birth = time.birthToDate(ymd);
      const { students } = state.membership.user;
      const pos = students.findIndex((stud) => stud.seq === student.seq);
      students.splice(pos, 1, student);
      // students[pos] = student;
      state.membership.user.students = [...students];
    },
    updateStudentProp(state, { student, prop, value }) {
      const { students } = state.membership.user;
      const pos = students.findIndex((stud) => stud.seq === student.seq);
      students[pos][prop] = value;
    },
    deleteStudent(state, student) {
      const { students } = state.membership.user;
      const pos = students.findIndex((stud) => stud.seq === student.seq);
      students.splice(pos, 1);
    },
    bindStudent(state, { student, license }) {
      license.studentRef = student.seq;
    },
  },

  actions: {
    autoLogin(ctx) {
      ctx.commit("initUser");
      if (ctx.state.jwt) {
        const activeLicense = ctx.rootGetters["exam/activeLicense"];
        return api.user
          .login(activeLicense?.uuid)
          .then((res) => {
            return installLoginData(ctx, res);
          })
          .catch((e) => {
            ctx.commit("logoutUser");
            throw e;
          });
      } else {
        return Promise.resolve(false);
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
    loginManual(ctx, args) {
      return api.user
        .loginManually(args.id, args.password)
        .then((res) => installLoginData(ctx, res));
    },
    join(ctx) {
      return api.user.join().then((res) => {
        ctx.commit("showWelcome");
        return installLoginData(ctx, res);
      });
    },
    createStudent(ctx, args) {
      const { name, birth, userId, pass, license, randomProps } = args;
      return api.student
        .register(name, birth, userId, pass, license?.uuid, randomProps)
        .then((res) => {
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
    updateStudentProp(ctx, { student, prop, value }) {
      return api.student.updateProp(student.seq, prop, value).then((res) => {
        const { student } = res;
        ctx.commit("updateStudent", student);
        return student;
      });
    },
    bindStudent(ctx, args) {
      const { license, student } = args;
      return api.license.bind(license.seq, student.seq).then(() => {
        ctx.commit("bindStudent", args);
      });
    },
    deleteStudent(ctx, student) {
      return api.student.delete(student.seq).then(() => {
        ctx.commit("deleteStudent", student);
      });
    },
  },
};

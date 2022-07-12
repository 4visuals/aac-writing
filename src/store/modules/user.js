import api from "@/service/api";
import storage from "@/service/storage";
import { time } from "@/service/util";
const installLoginData = (store, { membership, licenses, jwt }) => {
  membership.licenses = licenses;
  store.commit("setMembership", membership);
  store.commit("updateJwt", jwt);
  if (store.getters.isStudent) {
    store.commit("exam/setActiveLicense", licenses[0], { root: true });
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
      if (location.host.startsWith("192.168") && !state.jwt) {
        // mobile test
        state.jwt = jwt =
          "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTY3OTc2NDIsImlhdCI6MTY1Njc1NDQ0MiwiaXNzIjoiaHR0cHM6Ly9hYWNkaWN0Lnh5eiIsInN1YiI6IjEwMDIwMTAwMTE2MDExNDkzNTM4NCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJyb2xlIjoiVEVBQ0hFUiIsImdpdmVuX25hbWUiOiJZTiIsImxvY2FsZSI6ImtvIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBVFhBSnlmV1I2V0Z4bHBBMm5ZTFFYd0FkQ0xDWVpTcU1PME0tdnpoa3VSPXM5Ni1jIiwidmVuZG9yIjoiZ29vZ2xlIiwibmFtZSI6IllOIFNlbyIsInVzZXEiOjQyLCJhYWNfaWQiOjQyLCJmYW1pbHlfbmFtZSI6IlNlbyIsImVtYWlsIjoieWVvcmkuc2VvQGdtYWlsLmNvbSJ9.btLHOaW40He1zR_JxeBG1RWTRHXah-kfxkBfQ2rYHCA6sF0FnZuWoTnfgo8jYW08jVwd5k8pZFKWg6ekiycXK6YsCPlYKu5fAeMsj3QLBTjBm_rqSJeCPOSt_6Dl9P-0tY88_W_456P46Z9brqGcEDHThGfHHaq9-ibKUBHtbaJn9KRvelMN1_4KIIkzr4aHEOy4GQbIOYtbnl8WwR4EK90m2A3fFBQNRM9mRhm6p_dknY41tdTl9KCM7UXe64qbONeyTqtIyv_7-YpkPRQx4pH_JQiTDdgnUCIv_jbz0UL5NGCmLNQEqBf2sOqK_Tb-s7EvQ-JFxnQDQtMB6XAFiQ";
      }
      return jwt;
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
        return api.user.login().then((res) => {
          return installLoginData(ctx, res);
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

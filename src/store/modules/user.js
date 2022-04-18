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
        [];
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
      // if (!location.host.startsWith("localhost")) {
      //   // mobile test
      //   state.jwt =
      //     "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDk3ODU5NjMsImlhdCI6MTY0OTc0Mjc2MywiaXNzIjoiaHR0cHM6Ly9hYWNkaWN0Lnh5eiIsInN1YiI6IjEwMDIwMTAwMTE2MDExNDkzNTM4NCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJnaXZlbl9uYW1lIjoiWU4iLCJsb2NhbGUiOiJrbyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQVRYQUp5ZldSNldGeGxwQTJuWUxRWHdBZENMQ1laU3FNTzBNLXZ6aGt1Uj1zOTYtYyIsInZlbmRvciI6Imdvb2dsZSIsIm5hbWUiOiJZTiBTZW8iLCJ1c2VxIjoxNywiZmFtaWx5X25hbWUiOiJTZW8iLCJlbWFpbCI6Inllb3JpLnNlb0BnbWFpbC5jb20ifQ.aDoba7_822pdaKSLySPdsl4nM6Ju2xbq3yqVEf9JYHgMFhNJjRw-fLA0D1e7L2t3Ht2R4a_S0asT1DMsGOyqbB0P3LysgteHG9ddnz6MgFpHDU8iLy8ycOZuCK9_So3iSwcx32JilZws7JjN3pt1yA-yS_kQ9kR4iaWwFCeFzGuJercA7r26AZ77TkHv6jIOkn0wZaVDPavdx82DGUzmEsEfllioWa3Z-0_f73A1R7p3Pd_3KSy-hPOkiqhO_Qo-77paHVkC_jRkaErrPb2i90v1GvkJy3VfNuoFYaA1ji7lQWppivA-t4EgppOZigJOhIGLa9VALNCRLDyOHqeamQ";
      // }
      return jwt;
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
    bindStudent(ctx, args) {
      const { license, student } = args;
      return api.license.bind(license.seq, student.seq);
    },
  },
};

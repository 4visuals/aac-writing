import api from "@/service/api";
import storage from "@/service/storage";

export default {
  namespaced: true,
  state: () => ({ membership: null, jwt: null }),
  getters: {
    oauthed: (state) => state.membership && state.membership.profile,
    isMember: (state) => state.membership && state.membership.user,
  },
  mutations: {
    setMembership(state, membership) {
      membership.image = membership.profile.picture;
      state.membership = membership;
    },
    clearMembership(state) {
      state.membership = null;
    },
    updateJwt(state, jwt) {
      state.jwt = jwt;
      storage.local.write("aac_jwt_token", jwt);
    },
    initUser(state) {
      const jwt = storage.local.read("aac_jwt_token", null);
      state.jwt = jwt;
      return jwt;
    },
  },

  actions: {
    autoLogin(ctx) {
      ctx.commit("initUser");
      if (ctx.state.jwt) {
        return api.user.login().then((res) => {
          ctx.commit("setMembership", res.membership);
          ctx.commit("updateJwt", res.jwt);
        });
      }
    },
    checkMembership(ctx, args) {
      return api.user
        .membership(args.vendor, args.type, args.token)
        .then((res) => {
          ctx.commit("setMembership", res.membership);
          ctx.commit("updateJwt", res.jwt);
          return res.membership;
        });
    },
    join(ctx) {
      return api.user.join().then((res) => {
        ctx.commit("setMembership", res.membership);
        ctx.commit("updateJwt", res.jwt);
        return res.membership;
      });
    },
  },
};

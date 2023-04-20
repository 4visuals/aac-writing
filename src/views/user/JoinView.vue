<template>
  <div class="join-view">
    <WelcomeJoin
      v-if="userRef"
      :user="userRef"
      key="welcome"
      @close="$emit('close')"
    />
    <OauthJoinForm
      v-else
      :profile="membership.profile"
      @join="onJoinCompleted"
      key="form"
    />
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref } from "@vue/reactivity";
import OauthJoinForm from "../OauthJoinForm.vue";
import WelcomeJoin from "./WelcomeJoin.vue";
export default {
  components: {
    OauthJoinForm,
    WelcomeJoin,
  },
  props: ["membership"],
  setup() {
    const store = useStore();
    const pending = ref(null);
    const userRef = ref(null);
    const onJoinCompleted = (membership) => {
      userRef.value = membership.user;
    };
    const doJoin = () => {
      pending.value = { state: "LOADING" };
      store
        .dispatch("user/join")
        .then(() => {
          pending.value = null;
        })
        .catch((err) => {
          pending.value = { state: "ERROR", error: true, msg: err.desc };
          console.log("[error", err);
        });
    };
    return {
      userRef,
      pending,
      doJoin,
      onJoinCompleted,
    };
  },
};
</script>

<style lang="scss" scoped>
.join-view {
  padding: 16px;
  .userinfo {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 1px 0;
    .logo {
      margin: 8px 0;
    }
    .badge {
      padding: 0.6rem 1.2rem;
      border: 1px solid #efefef;
      border-radius: 40px;
      display: block;
    }
  }
  .btns {
    display: flex;
    column-gap: 1rem;
    justify-content: flex-end;
  }
}
</style>

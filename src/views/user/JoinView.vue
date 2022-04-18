<template>
  <div class="join-view">
    <h3>회원가입</h3>
    <ParaText>아래의 정보로 회원 가입합니다.</ParaText>
    <div class="userinfo">
      <Logo
        class="logo"
        size="md"
        :imagePath="membership.image"
        :vendor="membership.vendor"
      />
      <ParaText
        ><span class="badge">{{ membership.email }}</span></ParaText
      >
    </div>
    <div class="btns">
      <AacButton text="가입" theme="blue" @click="doJoin" />
      <AacButton text="닫기" theme="gray" />
    </div>
    <Loading
      v-if="pending"
      :pending="pending"
      @close="() => (pending = null)"
    />
  </div>
</template>

<script>
import { Loading } from "@/components";
import Logo from "@/components/oauth/Logo.vue";
import { ParaText } from "@/components/text";
import { AacButton } from "@/components/form";
import { useStore } from "vuex";
import { ref } from "@vue/reactivity";
export default {
  components: {
    Logo,
    ParaText,
    AacButton,
    Loading,
  },
  props: ["membership"],
  setup() {
    const store = useStore();
    const pending = ref(null);
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
      pending,
      doJoin,
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

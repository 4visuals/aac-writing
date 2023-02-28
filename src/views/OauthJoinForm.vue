<template>
  <div class="login-form">
    <TextField
      :field="form.email"
      v-model:value="form.email.value"
      icon="email"
      aria-placeholder="가입 이메일 입력"
      placeholder="이메일을 입력해주세요."
    />
    <div class="checkbox">
      <input
        type="checkbox"
        v-model="consent.TM.checked"
        id="consent-tos"
      /><label for="consent-tos">이용 약관</label
      ><button class="nude" @click="showTOS('TM')">보기</button>
    </div>

    <div class="checkbox">
      <input
        type="checkbox"
        v-model="consent.PV.checked"
        id="consent-privacy"
      /><label for="consent-privacy">개인정보 처리방침</label
      ><button class="nude" @click="showTOS('PV')">보기</button>
    </div>
    <AacButton
      theme="blue"
      fill
      borderless
      rect
      muted
      :text="modeText"
      @click="tryJoin"
    />
    <div class="error" v-if="error">
      <p>{{ error.message }}</p>
    </div>
    <Loading v-if="pending" :pending="pending" />
  </div>
</template>

<script>
import { Loading } from "@/components";
import { TextField } from "@/components/form";
import { ref } from "vue";
import modal from "@/components/modal";
// import { useRouter } from "vue-router";
// import { useStore } from "vuex";
import api from "@/service/api";
import PolicyView from "@/components/policy/PolicyView.vue";
import toast from "@/components/toast";
// import toast from "../components/toast";

export default {
  emits: ["join"],
  props: ["profile"],
  components: {
    TextField,
    Loading,
  },
  setup(props, { emit }) {
    // const store = useStore();
    // const router = useRouter();
    const formOption = {
      updated: "input",
      pendingVisible: true,
      disabled: true,
    };
    const consent = ref({
      PV: {
        md: "",
        checked: false,
      },
      TM: {
        md: "",
        checked: false,
      },
    });
    const form = ref({
      email: TextField.toModel("email", props.profile.email, formOption),
    });
    const modeText = "가입";
    const error = ref(null);
    const pending = ref(null);
    // const clearLoginUser = () => {
    //   store.commit("user/clearMembership");
    //   store.commit("exam/clear");
    // };
    const checkConsent = () => {
      const { PV, TM } = consent.value;
      const consented = PV.checked && TM.checked;
      if (!consented) {
        toast.warn("이용 약관 및 개인정보처리에 등의해주세요", "약관 동의", 5);
      }
      return consented;
    };
    const tryJoin = () => {
      if (!checkConsent()) {
        return;
      }
      // clearLoginUser();
      pending.value = { state: "LOADING", error: null, msg: "" };
      api.user
        .join()
        .then((res) => {
          pending.value = null;
          emit("join", res.membership);
        })
        .catch((err) => {
          pending.value.error = err;
        });
    };

    const showTOS = (type) => {
      console.log(consent.value[type].content);
      modal.showModal(PolicyView, {
        width: "sm",
        fill: true,
        props: {
          mdText: consent.value[type].content,
          padding: "16px",
        },
      });
    };
    api.policy.load().then((res) => {
      const { TM, PV } = res;
      consent.value.PV.content = PV.detail;
      consent.value.TM.content = TM.detail;
    });
    return {
      modeText,
      form,
      consent,
      error,
      pending,
      tryJoin,
      showTOS,
    };
  },
};
</script>

<style lang="scss" scoped>
.login-form {
  width: 100%;
  // max-width: 360px;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  padding: 0 16px 16px;
  position: relative;
  .btn-login {
    padding: 15px 0;
  }
  > .error {
    background-color: #fff3d3;
    color: #6c5000;
    padding: 16px 8px;
    p {
      font-size: 1.25rem;
    }
  }
  .checkbox {
    display: flex;
    align-items: center;
    label {
      margin-left: 8px;
    }
  }
}
</style>

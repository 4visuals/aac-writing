<template>
  <div class="login-form">
    <ParaText>
      {{ form.email }}
    </ParaText>
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
    <AppButton
      theme="blue"
      fill
      borderless
      muted
      size="plain"
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
// import { TextField } from "@/components/form";
import { ref } from "vue";
import modal from "@/components/modal";
import api from "@/service/api";
import PolicyView from "@/components/policy/PolicyView.vue";
import toast from "@/components/toast";
import ParaText from "../components/text/ParaText.vue";
import AppButton from "../components/form/AppButton.vue";

export default {
  emits: ["join"],
  props: ["profile"],
  components: {
    // TextField,
    Loading,
    ParaText,
    AppButton,
  },
  setup(props, { emit }) {
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
      email: props.profile.email,
    });
    const modeText = "가입";
    const error = ref(null);
    const pending = ref(null);
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
      modal.pushModal(PolicyView, {
        width: "sm",
        fill: true,
        props: {
          mdText: consent.value[type].content,
          padding: "16px",
          controlVisible: true,
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

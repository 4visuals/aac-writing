<template>
  <div class="login-form">
    <TextField
      :field="form.userId"
      v-model:value="form.userId.value"
      @updated="validate"
      icon="account_circle"
      aria-placeholder="아이디"
      placeholder="아이디를 입력해주세요."
    />
    <TextField
      :field="form.email"
      v-model:value="form.email.value"
      @updated="validate"
      icon="email"
      aria-placeholder="가입 이메일 입력"
      placeholder="이메일을 입력해주세요."
    />
    <TextField
      :field="form.password"
      v-model:value="form.password.value"
      @updated="validate"
      icon="password"
      type="password"
      aria-placeholder="비밀번호"
      placeholder="비밀번호를 입력해주세요."
    />
    <TextField
      :field="auxForm.password"
      v-model:value="auxForm.password.value"
      @updated="confirmPassword"
      icon="password"
      type="password"
      aria-placeholder="비밀번호 확인"
      placeholder="비밀번호 확인"
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
import { useStore } from "vuex";
import api from "@/service/api";
import message from "../service/message";
import PolicyView from "@/components/policy/PolicyView.vue";
import toast from "@/components/toast";
// import toast from "../components/toast";

export default {
  emits: ["join"],
  components: {
    TextField,
    Loading,
  },
  setup(props, { emit }) {
    const store = useStore();
    // const router = useRouter();
    const formOption = {
      updated: "input",
      pendingVisible: true,
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
      userId: TextField.toModel("userId", "", formOption),
      email: TextField.toModel("email", "", formOption),
      password: TextField.toModel("pass", "", formOption),
    });
    const auxForm = ref({
      password: TextField.toModel("confirm", "", formOption),
    });
    const modeText = "가입";
    const error = ref(null);
    const pending = ref(null);
    const clearLoginUser = () => {
      store.commit("user/clearMembership");
      store.commit("exam/clear");
    };
    const checkConsent = () => {
      const { PV, TM } = consent.value;
      const consented = PV.checked && TM.checked;
      if (!consented) {
        toast.warn("이용 약관 및 개인정보처리에 등의해주세요", "약관 동의", 5);
      }
      return consented;
    };
    const tryJoin = () => {
      clearLoginUser();
      if (!checkConsent()) {
        return;
      }
      console.log(form.value, auxForm.value);
      const { userId, email, password } = form.value;
      const pass2 = auxForm.value.password;
      if (
        userId.isValid() &&
        email.isValid() &&
        password.isValid() &&
        pass2.isValid()
      ) {
        pending.value = { state: "LOADING", error: null, msg: "" };
        api.user
          .joinManually({
            userId: userId.value,
            email: email.value,
            password: password.value,
          })
          .then((res) => {
            pending.value = null;
            res.user.pass = password.value;
            emit("join", res.user);
          })
          .catch((err) => {
            pending.value.error = err;
          });
      } else {
        toast.warn("가입 양식을 확인해주세요", null, 5);
      }
    };

    const validate = ({ value, field }) => {
      console.log(field.name, value, field.isChanged());
      if (value === "") {
        return;
      }
      if (field.name === "pass") {
        auxForm.value.password.reset();
      }
      api.user
        .checkPropForJoin(field.name, value)
        .then(() => {
          error.value = null;
          field.markAsValidated();
        })
        .catch((err) => {
          field.setError(true);
          error.value = { e: err, message: message.parse(err.cause) };
        });
    };
    const confirmPassword = (e) => {
      const { value, field } = e;
      if (value === "") {
        return;
      }
      const { password } = form.value;
      if (password.value !== value) {
        const err = { cause: "PASSWORD_MISMATCH" };
        error.value = { e: err, message: message.parse(err.cause) };
        field.setError(err);
      } else {
        field.markAsValidated();
        error.value = null;
      }
      console.log("done", e);
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
      auxForm,
      error,
      pending,
      tryJoin,
      validate,
      confirmPassword,
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

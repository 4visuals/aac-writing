<template>
  <div class="new-stud-form">
    <div
      :class="`item ${wizard.status}`"
      v-for="(wizard, idx) in wizardRef"
      :key="wizard.wid"
    >
      <div :class="`order`">
        <div class="line"></div>
        <div class="num">
          {{ idx + 1 }}
        </div>
      </div>
      <WizardForm
        :wizard="wizard"
        class="wizard"
        @value="normalize"
        @active="changeActiveWizard"
        @commit="commitValue"
      />
    </div>
    <div class="ctrl" v-if="userFormRef">
      <table class="overview">
        <tr class="prop" v-for="item in wizardRef" :key="item.wid">
          <td class="name">{{ item.title }}</td>
          <td class="value">{{ item.value }}</td>
        </tr>
      </table>
      <button class="nude blue round" @click="emitStudent">
        학생을 등록합니다.
      </button>
    </div>
  </div>
</template>

<script>
import util from "@/service/util";
import api from "@/service/api";
import message from "@/service/message";
import { ref } from "vue";
import WizardForm from "./teacher/WizardForm.vue";

export default {
  components: {
    WizardForm,
  },
  setup(_, { emit }) {
    const wizards = [
      {
        wid: "userId",
        title: "아이디",
        desc: "영문자와 숫자로 아이디를 입력헤주세요.",
        status: "active",
        value: "",
        error: null,
        filter: (val) => val.replace(/[^a-z0-9]/g, ""),
      },
      {
        wid: "birth",
        title: "생일",
        desc: "생일을 입력해주세요(예: 2010-03-15)",
        status: "pending",
        value: "",
        error: null,
        filter: (val) => val.replace(/[^0-9-]/g, "").replace(/-{2,}/g, "-"),
      },
      {
        wid: "name",
        title: "이름",
        desc: "학생 이름을 입력해주세요",
        status: "pending",
        value: "",
        error: null,
      },
      {
        wid: "pass",
        title: "비밀 번호",
        desc: "학생이 사용할 비밀번호입니다. 영문자와 숫자를 반드시 포함해야 합니다(특수문자 포함 추천).",
        status: "pending",
        type: "password",
        value: "",
        error: null,
      },
      {
        wid: "pass2",
        title: "비밀 번호 확인",
        desc: "비밀번호를 한 번 더 입럭해주세요.",
        status: "pending",
        type: "password",
        skip: true,
        value: "",
        error: null,
      },
    ];

    const normalizers = {
      birth: (value) => {
        value = value.replace(/[^0-9-]/g, "").replace(/-{2,}/g, "-");
        if (/^\d{4,4}$/.test(value)) {
          value = value + "-";
        } else if (/^\d{4}-\d{2}$/.test(value)) {
          value = value + "-";
        }
        const limit = Math.min(10, value.length);
        return value.substring(0, limit);
      },
    };
    const validators = {
      birth: (wizard) =>
        new Promise((success, failed) => {
          const { value } = wizard;
          const ymd = value.split("-");
          if (ymd.length !== 3) {
            failed(message.parse("MALFORMED_YMD"));
          } else if (!util.valid.y4md(value)) {
            failed(message.parse("MALFORMED_YMD"));
          } else {
            success();
          }
        }),
      userId: (wizard) =>
        new Promise((yes, no) => {
          const { value } = wizard;
          if (value.length < 6 || value.length > 16) {
            no("아이디는 6글자 이상, 16글자 이하여야 합니다.");
          } else {
            api.user.check
              .id(value)
              .then(() => {
                yes();
              })
              .catch((err) => {
                no(message.parse(err.cause));
              });
          }
        }),
      pass: (wizard) => {
        const pass = wizard.value.trim();
        if (pass.length < 6 || pass.length > 16) {
          return Promise.reject("@PASSWORD_LENGTH");
        } else if (!/[a-zA-Z]/.test(pass)) {
          return Promise.reject("@PASSWORD_FORMAT");
        } else if (!/[0-9]/.test(pass)) {
          return Promise.reject("@PASSWORD_FORMAT");
        } else {
          return Promise.resolve();
        }
      },
      pass2: (wizard) => {
        const passForm = wizards.find((wzd) => wzd.wid === "pass");
        if (passForm.value !== wizard.value) {
          return Promise.reject("비밀번호가 일치하지 않습니다.");
        } else {
          return Promise.resolve();
        }
      },
    };
    const wizardRef = ref(wizards);
    const userFormRef = ref(null);
    const moveNext = (wzd) => {
      const idx = wizards.findIndex((elem) => elem.wid === wzd.wid);
      wizardRef.value[idx].status = "confirmed";
      if (idx + 1 === wizards.length) {
        // 최종 화면
        const userForm = { editing: false };
        wizards.reduce((form, wzd) => {
          form[wzd.wid] = wzd.value;
          return form;
        }, userForm);

        userFormRef.value = userForm;
      } else {
        wizardRef.value[idx + 1].status = "active";
      }
    };
    const changeActiveWizard = (wizard) => {
      const oldWzd = wizardRef.value.find((wzd) => wzd.status === "active");
      if (oldWzd) {
        oldWzd.status = "pending";
      }
      wizard.status = "active";
    };
    const commitValue = (e) => {
      const { wizard } = e;
      const fn = validators[wizard.wid];
      if (fn) {
        fn(wizard)
          .then(() => moveNext(wizard))
          .catch((error) => {
            if (error.startsWith("@")) {
              error = message.parse(error.substring(1));
            }
            wizard.error = error;
          });
      } else {
        moveNext(wizard);
      }
    };
    const normalize = (e) => {
      let { wizard, value } = e;
      wizard.error = null;
      const fn = normalizers[wizard.wid];
      wizard.value = fn ? fn(value) : value;
    };
    const emitStudent = () => {
      const userForm = { editing: false };
      wizards.reduce((form, wzd) => {
        form[wzd.wid] = wzd.value;
        return form;
      }, userForm);
      emit("student", userForm);
    };
    return {
      wizardRef,
      userFormRef,
      commitValue,
      normalize,
      changeActiveWizard,
      emitStudent,
    };
  },
};
</script>

<style lang="scss" scoped>
.new-stud-form {
  max-width: 300px;
  .item {
    display: flex;
    column-gap: 16px;
    .order {
      position: relative;
      .line {
        position: absolute;
        width: 1px;
        height: 100%;
        background-color: black;
        top: 0;
        left: 50%;
        margin: 2px 0;
      }
      .num {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        margin: 0px 2px 2px;
        border: 1px solid;
        border-radius: 12px;
        font-size: 10px;
        position: relative;
        z-index: 5;
        background-color: white;
      }
    }
    .wizard {
      margin-bottom: 8px;
      flex: 1 1 auto;
      &.active {
        margin-bottom: 16px;
      }
    }
    &.pending {
      color: #999;
      .order {
        .line {
          background-color: #999;
        }
      }
    }
    &:last-child {
      .order .line {
        background-color: transparent;
      }
    }
  }
  .ctrl {
    padding: 8px;
    .overview {
      box-shadow: 0px 0px 2px #0000004d, 2px 2px 16px #00000022;
      border-radius: 6px;
      margin-bottom: 8px;
      padding: 8px;
      border-collapse: inherit;
      border-spacing: 0;
      .prop {
        td {
          padding: 4px;
          &.name {
            white-space: nowrap;
          }
          &.value {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>

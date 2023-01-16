<template>
  <div>
    <WidthLayout>
      <!--{ 
        "seq": 395, 
        "email": "yeori@gmail.com", "name": "yeori", "vendor": "MANUAL", "creationTime": "2022-12-01T06:20:52Z", "role": "TEACHER", "students": [], "student": false }-->
      <section class="account">
        <h4>기본 정보</h4>
        <table>
          <tr>
            <td>아이디</td>
            <td>{{ user.userId }}</td>
          </tr>
          <tr>
            <td>이메일</td>
            <td>{{ user.email }}</td>
          </tr>
        </table>

        <div class="hr-dash"></div>
        <div class="box">
          <h5>이름</h5>
          <TextField v-model:value="setting.user.name" icon="face" />
        </div>
      </section>
      <section>
        <h4>비밀번호 변경</h4>

        <div v-if="setting.password.unlock" class="box">
          <p>비밀번호를 변경합니다.</p>
          <p>영문자와 숫자를 모두 포함해야 합니다.</p>
          <p>비밀번호는 6 ~ 16글자이어야 합니다.</p>
          <TextField
            v-model:value="setting.password.form.newPass"
            type="password"
            icon="password"
            placeholder="새로운 비밀번호"
          />
          <TextField
            v-model:value="setting.password.form.auxPass"
            type="password"
            icon="password"
            placeholder="비밀번호 확인"
          />
          <div class="btns">
            <FormButton :round="false" text="비밀번호 변경" @click="changePw" />
            <FormButton
              :round="false"
              text="취소"
              theme="red"
              @click="hidePw"
            />
          </div>
        </div>
        <div v-else class="box">
          <p>현재 비밀번호를 입력 후 새로운 비밀번호를 설정할 수 있습니다.</p>
          <TextField
            type="password"
            icon="password"
            placeholder="비밀번호 입력 후 엔터"
            @enter="unlockPassword"
          />
        </div>
      </section>
      <section>
        <h4>탈퇴하기</h4>
        <div v-if="setting.unsub.unlock" class="box">
          <p>
            가입 정보, 수강증, 학습 이력, 학생 정보를 모두 삭제합니다. 삭제한
            정보들은 복구할 수 없습니다.
          </p>
          <p>아래 버튼을 누르면 탈퇴 후 로그아웃됩니다.</p>
          <div class="btns">
            <FormButton
              :round="false"
              text="탈퇴합니다"
              theme="red"
              @click="doUnsubscription"
            />
          </div>
        </div>
        <div v-else class="box">
          <p>탈퇴를 시작하려면 비밀번호를 입력해주세요.</p>
          <TextField
            type="password"
            icon="password"
            placeholder="비밀번호 입력 후 엔터"
            @enter="unlockUnSub"
          />
        </div>
      </section>
    </WidthLayout>
  </div>
</template>

<script>
import { computed, reactive } from "vue";
import { useStore } from "vuex";
import WidthLayout from "../../../../components/layout/WidthLayout.vue";
import TextField from "../../../../components/form/TextField.vue";
import FormButton from "../../../../components/form/FormButton.vue";

import api from "@/service/api";
import toast from "../../../../components/toast";
import { useRouter } from "vue-router";

export default {
  components: {
    WidthLayout,
    TextField,
    FormButton,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const user = computed(() => store.getters["user/currentUser"]);
    const setting = reactive({
      user: {
        name: user.value.name,
      },
      unsub: {
        unlock: false,
        form: {
          curPass: "",
        },
      },
      password: {
        unlock: false,
        form: {
          curPass: "",
          newPass: "",
          auxPass: "",
        },
      },
    });

    const unlockUnSub = (password) => {
      api.setting.password
        .unlock(password)
        .then(() => {
          setting.unsub.unlock = true;
          setting.unsub.form.curPass = password;
        })
        .catch((err) => {
          toast.error(`@${err.cause}`, "비밀번호 불일치", 5);
        });
    };
    const unlockPassword = (password) => {
      api.setting.password
        .unlock(password)
        .then(() => {
          setting.password.unlock = true;
          setting.password.form.curPass = password;
        })
        .catch((err) => {
          toast.error(`@${err.cause}`, "비밀번호 불일치", 5);
        });
    };
    const changePw = () => {
      const { curPass, newPass, auxPass } = setting.password.form;

      if (newPass !== auxPass || newPass.length === 0) {
        toast.warn("@PASSWORD_MISMATCH", "비밀번호 확인", 5);
        return;
      }
      api.setting.password
        .change(newPass, curPass)
        .then(() => {
          hidePw();
          toast.success("비밀번호 변경 완료", "성공", 5);
        })
        .catch((err) => {
          toast.warn(`@${err.cause}`, "실패", 10);
        });
    };
    const hidePw = () => {
      setting.password.unlock = false;
      const { form } = setting.password;
      form.newPass = form.curPass = form.auxPass = "";
    };
    const doUnsubscription = () => {
      api.setting.unsubscribe().then((res) => {
        console.log(res);
        store.commit("user/logoutUser");
        alert("회원 정보를 모두 삭제했습니다.");
        router.replace("/");
      });
    };
    return {
      setting,
      user,
      unlockUnSub,
      unlockPassword,
      changePw,
      hidePw,
      doUnsubscription,
    };
  },
};
</script>

<style lang="scss" scoped>
section {
  box-shadow: 0px 0px 4px #0000001d, 0 0 2px #0000002d;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  font-size: 1.15rem;
  transition: box-shadow 0.2s linear, transform 0.2s linear;
  &:hover {
    box-shadow: 0px 0px 8px #2f8ed87a, 0 0 2px #2f8ed8c7;
    transform: scale(1.01);
  }
  h4 {
    margin-bottom: 8px;
  }
  .box {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
  }
  .btns {
    display: flex;
    column-gap: 8px;
  }
}
.account {
  table {
    font-size: 1.15rem;
    tr {
      padding-bottom: 4px;
      td {
        padding: 0 4px;
      }
    }
  }
}
.change-pw {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}
</style>

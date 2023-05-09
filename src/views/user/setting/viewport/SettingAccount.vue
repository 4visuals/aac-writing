<template>
  <div>
    <WidthLayout align="left" maxWidth="480px">
      <!--{ 
        "seq": 395, 
        "email": "yeori@gmail.com", "name": "yeori", "vendor": "MANUAL", "creationTime": "2022-12-01T06:20:52Z", "role": "TEACHER", "students": [], "student": false }-->
      <main class="account">
        <table>
          <tbody>
            <tr>
              <td><SpanText class="label">이름</SpanText></td>
              <td>
                <SpanText>{{ user.name }}</SpanText>
              </td>
              <td><!--<SpanText>회원 탈퇴</SpanText>--></td>
            </tr>
            <tr>
              <td><SpanText class="label">이메일</SpanText></td>
              <td>
                <SpanText>{{ user.email }}</SpanText>
              </td>
              <td></td>
            </tr>
            <tr>
              <td><SpanText class="label">학생</SpanText></td>
              <td>
                <SpanText
                  >{{ user.students ? user.students.length : 0 }}명</SpanText
                >
              </td>
              <td>
                <AppButton
                  theme="yellow"
                  size="setting"
                  fill
                  text="학생 등록"
                  borderColor="#ffd110"
                  @click="settingNav.goTo('student')"
                ></AppButton>
              </td>
            </tr>
            <tr>
              <td><SpanText class="label">이용권</SpanText></td>
              <td>
                <SpanText>미등록 {{ notUsedLcs.length }}장</SpanText>/
                <SpanText>이용중 {{ activatedLcs.length }}장</SpanText>
              </td>
              <td>
                <AppButton
                  theme="indigo"
                  size="setting"
                  fill
                  text="이용권 등록"
                  @click="settingNav.goTo('license')"
                ></AppButton>
              </td>
            </tr>
            <tr>
              <td><SpanText class="label">구매내역</SpanText></td>
              <td>
                <SpanText>{{ orders.length }}건</SpanText>
              </td>
              <td>
                <AppButton
                  theme="mono-blue"
                  fill
                  size="setting"
                  text="구매내역 보기"
                  @click="settingNav.goTo('order')"
                ></AppButton>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
      <!-- <section>
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
      </section> -->
    </WidthLayout>
  </div>
</template>

<script>
import api from "@/service/api";
import { computed, reactive, ref, inject } from "vue";
import { useStore } from "vuex";
import WidthLayout from "../../../../components/layout/WidthLayout.vue";
// import TextField from "../../../../components/form/TextField.vue";
// import FormButton from "../../../../components/form/FormButton.vue";
import { SpanText } from "@/components/text";

import toast from "../../../../components/toast";
import { useRouter } from "vue-router";

export default {
  components: {
    WidthLayout,
    SpanText,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const user = computed(() => store.getters["user/currentUser"]);
    const licenses = store.getters["user/validLicenses"];
    const activatedLcs = licenses.filter((lcs) => lcs.isInUse());
    const notUsedLcs = licenses.filter((lcs) => !lcs.isInUse());
    const orders = ref([]);
    const settingNav = inject("settingNav");

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
    const loadOrders = () => {
      api.order.list().then((res) => {
        orders.value = res.orders;
      });
    };

    loadOrders();
    return {
      setting,
      user,
      activatedLcs,
      notUsedLcs,
      orders,
      unlockUnSub,
      unlockPassword,
      changePw,
      hidePw,
      doUnsubscription,
      settingNav,
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
  background-color: white;
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
.label {
  font-weight: 600;
  white-space: nowrap;
}
.account {
  table {
    font-size: 1.15rem;
    tr {
      padding-bottom: 4px;
      td {
        padding: 1rem;
      }
    }
  }
  @media (max-width: 767px) {
    table {
      tr {
        td {
          padding-left: 0;
          padding-right: 0;
        }
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

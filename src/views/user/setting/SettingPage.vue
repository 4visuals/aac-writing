<template>
  <div class="setting">
    <section class="left-menu">
      <SettingNav :menus="menus" />
    </section>
    <section class="viewport">
      <SettingJumbo @action="handleAction" />
      <div class="view">
        <router-view
          @new-student="showNewStudentForm"
          @del-student="startStudentRemoval"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import SettingNav from "./SettingNav.vue";
import MenuItem from "./menu-item";
import NavAction from "./nav-action";
import settingStore from "./setting-store";
import SettingJumbo from "./SettingJumbo.vue";
import modal from "@/components/modal";
import DialogView from "@/components/dialog/DialogView.vue";
import NewStudentForm from "@/components/admin/NewStudentForm.vue";
import toast from "@/components/toast";
import { useRoute, useRouter } from "vue-router";
export default {
  components: {
    SettingNav,
    SettingJumbo,
  },

  setup() {
    const store = useStore();
    const user = computed(() => store.getters["user/isMember"]);
    const router = useRouter();
    const activeMenu = computed(() => store.state.setting.active);

    const registerStudent = (student) => {
      console.log(student);
      const { name, birth } = student;
      /**
       * randomProps
       * - true인 경우 userId, password 등에 대해 임의의 값을 지정하도록 함
       * - 학생 등록 시 name, id, birth, password를 모두 입력받았으나
       * - 낱개로 구매한 이용권에 대해서는 등록되는 학생의 name과 birth만 입력받음
       * - 학생이 연결되는 이용권이 단체 구매용인지 낱개 구매인지 확정적이지 않으므로
       * - 학생 등록시에는 name, birth 만 받은 후 서버에서 임의의 값을 지정함
       */
      store
        .dispatch("user/createStudent", { name, birth, randomProps: true })
        .then(() => {
          toast.success("@NEW_USER_SUCCESS", null, 5);
          modal.closeModal();
        })
        .catch((e) => {
          toast.error(`@${e.cause}`, `실패`, 15);
        });
    };
    /**
     * 학생 등록 양식 시작
     */
    const showNewStudentForm = () => {
      console.log("[new stud]");
      modal.showModal(NewStudentForm, {
        width: "sm",
        padding: "16px",
        props: {
          exclude: ["userId", "pass"],
        },
        events: {
          student: registerStudent,
        },
      });
    };
    const goToOrder = () => {
      router.push("/purchase");
    };
    const actionMap = {
      "new-student": showNewStudentForm,
      "new-order": goToOrder,
    };
    const menus = [
      new MenuItem("", "home", "마이페이지"),
      new MenuItem("account", "account_circle", "내 정보"),
      new MenuItem("license", "badge", "이용권", [
        new NavAction("new-order", "이용권 구매", "add"),
      ]),
      new MenuItem("student", "face", "학생 관리", [
        new NavAction("new-student", "학생 추가", "add"),
      ]),
      new MenuItem("order", "monetization_on", "구매 내역"),
      // new MenuItem("students", "people", "학생들"),
    ];
    store.registerModule("setting", settingStore);
    store.commit("setting/setMenus", menus);
    store.commit("ui/setBackgroundVisible", false);
    const path = useRoute().fullPath.split("/").reverse()[0];
    console.log(useRoute().fullPath);
    const active = menus.find((m) => m.path === path);
    store.commit("setting/setActive", active || menus[0]);
    const handleAction = (action) => {
      const fn = actionMap[action.id];
      if (fn) {
        fn();
      }
    };

    const deleteStudent = (student) => {
      console.log("[del]", student);
      store
        .dispatch("user/deleteStudent", student)
        .then(() => {
          modal.closeModal();
          toast.success(
            `[성공] ${student.name} 학생 삭제 완료`,
            "학생 삭제 성공",
            5
          );
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const startStudentRemoval = (student) => {
      modal.showModal(DialogView, {
        width: "sm",
        props: {
          title: "학생 삭제",
          message: `[${student.name}] 학생을 삭제합니까? 모든 학습 기록도 삭제됩니다.`,
          actions: [
            {
              cmd: "yes",
              text: "삭제합니다",
              trigger: () => deleteStudent(student),
            },
            { cmd: "no", text: "취소", trigger: () => modal.closeModal() },
          ],
        },
      });
    };

    onMounted(() => {});
    onUnmounted(() => {
      store.unregisterModule("setting");
    });

    return {
      user,
      activeMenu,
      menus,
      showNewStudentForm,
      startStudentRemoval,
      handleAction,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
$mwidth: 220px;
.setting {
  font-family: "NanumSquareRound", "Noto Sans KR", sans-serif;
  // font-weight: 700;
  display: flex;
  height: 100%;
  .left-menu {
    position: relative;
    flex: 0 0 $mwidth;
    width: $mwidth;
    background-color: azure;
  }
  .viewport {
    position: relative;
    flex: 1 1 auto;
    overflow-y: auto;
    .view {
      margin: 16px;
    }
  }
}
@include mobile {
  .setting {
    .left-menu {
      width: 44px;
      flex: 0 0 44px;
    }
  }
}
@include tablet {
}
@include desktop {
}
</style>
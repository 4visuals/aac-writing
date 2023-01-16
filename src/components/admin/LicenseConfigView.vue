<template>
  <div class="lcs-config-view">
    <div class="dimmer" v-if="slideMenuRef.visible" @click="hideMenu"></div>
    <div class="lcs-view" v-if="slideMenuRef.visible">
      <div class="order-lcs" v-if="readOnly">
        <h4>읽기 전용 모드</h4>
        <p>이 화면은 사용자의 수강증, 학생 정보를 보여줍니다.</p>
      </div>
      <div class="order-lcs" v-else>
        <p>수강증이 더 필요하신가요?</p>
        <FormButton
          icon="sell"
          text="수강증 추가 구매"
          size="sm"
          @click="showLcsPurchase"
        />
      </div>
      <LicenseItem
        v-for="lcs in licenses"
        :students="students"
        :lcs="lcs"
        :current="current"
        :active="active === lcs"
        :key="lcs.seq"
        size="sm"
        @click="showStudentDetail(lcs)"
      >
      </LicenseItem>
    </div>
    <div class="btn-show-menu" v-else @click="slideMenuRef.visible = true">
      <AppIcon icon="menu" fsize="16px" />
    </div>
    <div v-if="viewMode === 'STUD'" class="stud-view">
      <div class="mgb-16px">
        <h3 class="mgb-8px" :class="{ exp: active.isExpired() }">
          <span>수강증</span
          ><AppIcon
            class="warning"
            v-if="active.isExpired()"
            icon="warning_amber"
          />
        </h3>
        <div class="license" :class="{ exp: active.isExpired() }">
          <span class="icon material-icons-outlined"> sell </span
          ><span class="code">{{ active.uuid }}</span>
        </div>
        <table class="table">
          <tr>
            <td class="label">
              <div class="cell">
                <AppIcon icon="data_saver_off" fsize="16px" /><span>상태</span>
              </div>
            </td>
            <td>
              <div class="cell">{{ status[active.status] }}</div>
            </td>
          </tr>
          <tr>
            <td class="label">
              <div class="cell">
                <AppIcon icon="schedule" fsize="16px" /><span>발급일</span>
              </div>
            </td>
            <td>
              <div class="cell">{{ timeText(active.createdAt) }}</div>
            </td>
          </tr>
          <tr>
            <td class="label">
              <div class="cell">
                <AppIcon icon="schedule" fsize="16px" /><span>만료일</span>
              </div>
            </td>
            <td>
              <div class="cell">{{ timeText(active.expiredAt) }}</div>
            </td>
          </tr>
        </table>
      </div>
      <StudentRegForm
        class="stud-form"
        @editing="error = null"
        @commit="registerStudent"
        :editable="!readOnly"
        :student="studentInUse"
        :error="error"
        v-if="studentInUse"
      />
      <div v-else-if="!readOnly" class="no-bound-stud">
        <p class="mg8px">수강증에 새로운 학생을 추가할 수 있습니다.</p>
        <NewStudentForm v-if="newStudForm" @student="registerStudent" />
        <button v-else class="nude blue round" @click="showNewStudForm">
          학생 등록 시작
        </button>
      </div>
    </div>
    <div v-else-if="viewMode === 'LCS'" class="stud-view">
      <LicenseOrderForm />
    </div>
    <div v-else class="stud-view">
      <p class="jumbo">수강증을 구매하거나 학생 정보를 수정할 수 있습니다.</p>
    </div>
  </div>
</template>

<script>
import LicenseItem from "./LicenseItem.vue";
import StudentRegForm from "./StudentRegForm.vue";
import NewStudentForm from "./NewStudentForm.vue";
import { ref, watch } from "@vue/runtime-core";
import { useStore } from "vuex";
import toast from "../../components/toast";
import LicenseOrderForm from "../license/LicenseOrderForm.vue";
import { time } from "@/service/util";
export default {
  props: ["license", "licenses", "students", "readOnly"],
  components: {
    LicenseItem,
    NewStudentForm,
    StudentRegForm,
    LicenseOrderForm,
  },
  setup(props) {
    const store = useStore();
    const active = ref(props.license || props.licenses[0]);
    const studentInUse = ref(null);
    const error = ref(null);
    const assignables = ref(null);
    const current = ref(new Date().getTime());
    const newStudForm = ref(false);
    const viewMode = ref("STUD");
    const slideMenuRef = ref({ visible: true });
    const status = {
      USING: "사용중",
      EXPIRED: "만료됨",
      READY: "대기중",
    };

    const studentReg = ref({
      name: "",
      id: "",
      password: "",
      birthday: "",
      visible: false,
    });
    const showLcsPurchase = () => {
      viewMode.value = "LCS";
    };
    const showStudentDetail = (lcs) => {
      viewMode.value = "STUD";
      active.value = lcs;
    };
    const updateUse = () => {
      const license = active.value;
      if (!license) {
        return;
      }
      const idx = props.students.findIndex(
        (s) => license && license.studentRef === s.seq
      );
      newStudForm.value = false;
      studentReg.value.visible = false;
      studentInUse.value = props.students[idx];
      assignables.value = props.students.filter(
        (s) =>
          s !== studentInUse.value &&
          !props.licenses.find((lcs) => lcs.studentRef === s.seq)
      );
    };

    const bindStudent = (student) => {
      if (!active.value) {
        return;
      }
      store
        .dispatch("user/bindStudent", { license: active.value, student })
        .then((res) => {
          active.value.studentRef = res.curStud;
          updateUse();
        });
    };
    const registerStudent = (student) => {
      const { name, userId, birth, pass, editing } = student; // studentReg.value;
      console.log(name, userId, birth, pass, editing);
      const method = editing ? "user/updateStudent" : "user/createStudent";
      const args = editing
        ? { student, props: { name, userId, birth, pass } }
        : { name, userId, birth, pass, license: active.value };
      store
        .dispatch(method, args)
        .then(() => {
          updateUse();
          const msgCode = editing ? "@USER_EDIT_SUCCESS" : "@NEW_USER_SUCCESS";
          toast.success(msgCode, null, 5);
        })
        .catch((e) => {
          console.log("[error]", e);
          error.value = e.cause;
          toast.error(`@${e.cause}`, `실패`, 15);
        });
    };
    const openStudenEditor = () => {
      console.log("done");
    };
    const showNewStudForm = () => {
      newStudForm.value = true;
    };

    const hideMenu = () => {
      slideMenuRef.value.visible = false;
    };
    const timeText = (millis) => {
      return millis
        ? time.toYMD(Date.parse(millis))
        : "사용 전입니다. 햑생을 등록해주세요";
    };

    watch(() => active.value, updateUse, { immediate: true });
    return {
      current,
      active,
      error,
      studentInUse,
      assignables,
      studentReg,
      newStudForm,
      viewMode,
      slideMenuRef,
      status,
      bindStudent,
      showStudentDetail,
      registerStudent,
      openStudenEditor,
      showNewStudForm,
      showLcsPurchase,
      hideMenu,
      timeText,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.lcs-config-view {
  display: flex;
  margin-top: 4px;
  align-items: flex-start;
  flex: 1 1 auto;
  overflow-y: auto;
  position: relative;
  .dimmer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #0000004d;
    z-index: 5;
    display: none;
  }
  .lcs-view {
    flex: 0 0 220px;
    padding: 0 16px 16px;
    background-color: white;
    .order-lcs {
      margin: 16px 0 16px;
      padding: 8px 16px;
      background-color: #c9ffc9;
      p {
        margin-bottom: 8px;
      }
    }
  }
  .btn-show-menu {
    position: fixed;
    top: 56px;
    left: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: #fff;
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
    z-index: 5;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    transition: width 0.15s cubic-bezier(0.5, 0.25, 0, 1);
    &:hover {
      width: 40px;
    }
  }
  @include mobile {
    .dimmer {
      display: flex;
    }
    .lcs-view {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 5;
      width: 220px;
      box-shadow: 2px 0 8px #0000004d;
      overflow: auto;
    }
    .stud-view {
      margin-top: 32px;
    }
  }
  .stud-view {
    flex: 1 1 auto;
    padding: 16px;
    position: sticky;
    top: 0;
    h3 {
      font-size: 1.25rem;
      display: flex;
      align-items: center;
      &.exp {
        color: #8b1027;
      }
      .alert {
        margin-left: 4px;
        font-size: 16px;
      }
    }
    .stud-list {
      display: flex;
      margin: 0.6rem 0;
    }
    .stud-form {
      max-width: 400px;
      display: flex;
      row-gap: 8px;
      flex-direction: column;
      align-items: flex-start;
    }
    .license {
      display: inline-flex;
      align-items: center;
      column-gap: 6px;
      background-color: #ffe647;
      padding: 8px;
      color: #444;
      border-radius: 4px;
      border: 1px solid #777;
      user-select: none;
      &.exp {
        background-color: #ffd7d7;
        color: #8b1027;
        border-color: transparent;
      }
      .icon {
        font-size: 14px;
      }
    }
    .table {
      td {
        .cell {
          display: flex;
          align-items: center;
          > span + span {
            margin-left: 4px;
          }
        }
        padding: 4px;
      }
    }
  }
  .jumbo {
    min-height: 240px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

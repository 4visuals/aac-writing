<template>
  <div class="stud-view">
    <SectionBox v-if="students.length === 0" class="none"
      ><p>등록된 학생이 없습니다.</p>
      <button class="nude blue" @click="$emit('new-student')">학생 추가</button>
    </SectionBox>
    <div class="students">
      <SectionBox
        v-for="asn in assignees"
        :key="asn.student.seq"
        @click="showStudentForm(asn.student)"
        ><div class="student">
          <h5>{{ asn.student.name }}</h5>
          <div class="birth">{{ ymd(asn.student.birth) }}</div>
          <ActionIcon
            class="stud-del"
            icon="delete"
            :disabled="asn.license && asn.license.isInUse()"
            @click.stop="$emit('del-student', asn.student)"
          />
        </div>
        <div
          v-if="asn.license"
          class="license"
          :class="{ exp: asn.license.isExpired() }"
        >
          <span class="icon material-icons-outlined"> sell </span
          ><span class="code">{{
            asn.license.isExpired() ? "이용권 만료됨" : "이용중"
          }}</span>
        </div>
        <div v-else class="license none">연결된 이용권 없음</div></SectionBox
      >
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import SectionBox from "../ui/SectionBox.vue";
import { time } from "@/service/util";
import modal from "@/components/modal";
import StudentRegForm from "@/components/admin/StudentRegForm.vue";

export default {
  components: {
    SectionBox,
  },
  setup() {
    const store = useStore();
    const students = computed(() => store.getters["user/students"]);
    const licenses = computed(() => store.state.user.membership.licenses);

    const assignees = ref(null);

    const buildAssignees = () => {
      assignees.value = students.value.map((student) => ({
        student,
        license: licenses.value.find((lcs) => lcs.studentRef === student.seq),
      }));
    };

    const showStudentForm = (student) => {
      modal.showModal(StudentRegForm, {
        width: "sm",
        padding: "16px",
        props: {
          student,
          exclude: [],
        },
      });
    };
    const ymd = (birth) => time.toYMD(birth);
    const hasRegistred = (student) => licenseOf(student);
    const licenseOf = (student) =>
      licenses.value.find((lcs) => lcs.student === student.seq);

    watch(students, buildAssignees, { immediate: true, deep: true });
    return {
      students,
      licenses,
      ymd,
      showStudentForm,
      hasRegistred,
      licenseOf,
      assignees,
    };
  },
};
</script>

<style lang="scss" scoped>
.stud-view {
  .none {
    p {
      margin-bottom: 16px;
    }
  }
  .student {
    position: relative;
    margin-bottom: 8px;
    .stud-del {
      position: absolute;
      top: -4px;
      right: -4px;
      font-size: 20px;
      color: var(--aac-color-red-900);
      padding: 4px;
      &:hover {
        background-color: var(--aac-color-red-200);
      }
    }
  }
  .license {
    display: inline-flex;
    align-items: center;
    column-gap: 6px;
    background-color: #ffe647;
    padding: 3px 8px;
    color: #444;
    border-radius: 4px;
    // border: 1px solid #ccc072;
    user-select: none;
    &.none {
      background-color: #efefef;
      color: #777;
    }
    &.exp {
      background-color: #ffd7d7;
      color: #8b1027;
      border-color: transparent;
    }
    .icon {
      font-size: 14px;
    }
  }
}
</style>

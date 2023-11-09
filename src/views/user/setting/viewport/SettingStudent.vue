<template>
  <div class="stud-view">
    <SectionBox v-if="students.length === 0" class="none"
      ><p>등록된 학생이 없습니다.</p>
      <button class="nude blue" @click="$emit('new-student')">학생 추가</button>
    </SectionBox>
    <div class="students">
      <div class="container-fluid">
        <div class="row">
          <div
            class="col-12 col-sm-6 col-md-6 col-lg-4"
            v-for="asn in assignees"
            :key="asn.student.seq"
          >
            <SectionBox class="fill-h"
              ><StudentCard
                :assigned="asn"
                @edit="showStudentForm(asn.student)"
                @del-student="$emit('del-student', asn.student)"
            /></SectionBox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import SectionBox from "@/components/SectionBox.vue";

import modal from "@/components/modal";
import StudentRegForm from "@/components/admin/StudentRegForm.vue";
import StudentCard from "../components/StudentCard.vue";

export default {
  components: {
    SectionBox,
    StudentCard,
  },
  setup() {
    const store = useStore();
    const students = computed(() => store.getters["user/students"]);
    const licenses = computed(() =>
      store.state.user.membership.licenses.filter((lcs) => lcs.isAvailable())
    );
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
    // const ymd = (birth) => time.toYMD(birth);

    const licenseOf = (student) =>
      licenses.value.find((lcs) => lcs.student === student.seq);

    watch(students, buildAssignees, { immediate: true, deep: true });
    return {
      students,
      licenses,
      // ymd,
      showStudentForm,
      licenseOf,
      assignees,
    };
  },
};
</script>

<style lang="scss" scoped>
.stud-view {
  .students {
    .container-fluid > .row > * {
      margin-bottom: 16px;
    }
    .fill-h {
      height: 100%;
    }
  }
  .none {
    p {
      margin-bottom: 16px;
    }
  }
}
</style>

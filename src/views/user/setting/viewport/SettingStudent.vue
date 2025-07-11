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
                @reg-license="showBindingForm"
                @diagnosis="showAssessmentView"
            /></SectionBox>
          </div>
          <div class="col-12 col-sm-6 col-md-6 col-lg-4">
            <SectionBox class="fill-h">
              <div class="new-student">
                <button class="btn-new nude blue" @click="$emit('new-student')">
                  <span class="material-icons-outlined">add</span>
                  <span>학생 추가</span>
                </button>
              </div>
            </SectionBox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import SectionBox from "@/components/SectionBox.vue";

import modal from "@/components/modal";
import StudentRegForm from "@/components/admin/StudentRegForm.vue";
import StudentCard from "../components/StudentCard.vue";
import AssessmentView from "@/components/stats/assessment/AssessmentView.vue";
import LicenseMappingList from "../components/LicenseMappingList.vue";
import toast from "@/components/toast";

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

const showAssessmentView = (assigned) => {
  const { student, license } = assigned;
  modal.showModal(AssessmentView, {
    width: "",
    fill: true,
    props: {
      assignees,
      student,
      license,
    },
    events: {
      close: (e) => {
        console.log(e);
      },
    },
  });
};
const bindStudent = (student, license) => {
  store.dispatch("user/bindStudent", { license, student }).then(() => {
    buildAssignees();
    toast.success(
      `수강증에 [${student.name}] 학생을 등록했습니다. `,
      "등록 완료",
      10
    );
  });
  modal.closeModal();
};
const showBindingForm = (e) => {
  modal.showModal(LicenseMappingList, {
    width: "sm",
    props: {
      student: e.student,
    },
    events: {
      "bind-license": (e) => {
        bindStudent(e.student, e.license);
      },
      close: (e) => {
        console.log(e);
      },
    },
  });
};

watch(students, buildAssignees, { immediate: true, deep: true });
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
    .new-student {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      .btn-new {
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        font-size: 1.2rem;
        box-shadow: 0 0 24px #00238a4d, 0 0 6px #00238a8d;
      }
    }
  }
  .none {
    p {
      margin-bottom: 16px;
    }
  }
}
</style>

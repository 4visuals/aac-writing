<template>
  <div class="lcs-view">
    <SectionBox
      padding="0"
      v-for="lcs in filterValidLicense()"
      :key="lcs.uuid"
      class="lcs"
    >
      <LicenseItemUI :license="lcs" :current="now" @clicked="showBindingForm" />
    </SectionBox>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import modal from "@/components/modal";
import StudentList from "../components/StudentList.vue";
import LicenseItemUI from "../ui/LicenseItemUI.vue";
import toast from "@/components/toast";
import SectionBox from "../ui/SectionBox.vue";
export default {
  components: {
    LicenseItemUI,
    SectionBox,
  },
  setup() {
    const store = useStore();
    const licenses = computed(() => store.state.user.membership.licenses);
    const now = ref(new Date());
    const bindStudent = (student, license) => {
      store.dispatch("user/bindStudent", { license, student }).then(() => {
        toast.success(
          `수강증에 [${student.name}] 학생을 등록했습니다. `,
          "등록 완료",
          10
        );
      });
      modal.closeModal();
    };
    const showBindingForm = (license) => {
      modal.showModal(StudentList, {
        width: "sm",
        events: {
          student: (student) => bindStudent(student, license),
        },
      });
    };

    const filterValidLicense = () =>
      licenses.value.filter(
        (/** @type {import('../../../../entity/license').default} */ lcs) =>
          !lcs.isExpired()
      );
    return { now, licenses, filterValidLicense, showBindingForm };
  },
};
</script>

<style lang="scss" scoped>
.lcs-view {
  max-width: 560px;
  .lcs {
    margin-bottom: 16px;
  }
}
</style>

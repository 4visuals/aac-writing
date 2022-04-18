<template>
  <div class="lcs-view">
    <SpanText
      class="lcs-label"
      :class="{ none: !activeLicense }"
      @click="showLicenseBox"
      >{{ activeLicense ? studentName(activeLicense) : "학생 선택" }}</SpanText
    >
    <div class="lcs-list" v-if="boxVisible">
      <SpanText
        class="lcs-label lcs"
        v-for="lcs in licenses"
        :key="lcs.seq"
        @click="chooseLicense(lcs)"
      >
        {{ studentName(lcs) }}
      </SpanText>
    </div>
  </div>
</template>

<script>
import { SpanText } from "@/components/text";
import { computed, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
export default {
  components: {
    SpanText,
  },
  setup() {
    const store = useStore();
    const logined = !!store.state.user.membership;
    const licenses = computed(() =>
      logined ? store.state.user.membership.licenses : []
    );
    const students = store.getters["user/students"];
    const activeLicense = computed(() => store.getters["exam/activeLicense"]);
    const boxVisible = ref(false);

    const showLicenseBox = () => {
      if (!logined) {
        alert("로그인 해주세요");
        return;
      }
      boxVisible.value = true;
    };
    const studentName = (license) => {
      const student = students.find((s) => s.seq === license.studentRef);
      return student ? student.name : "빈 수강권";
    };
    const chooseLicense = (license) => {
      store.commit("exam/setActiveLicense", license);
      boxVisible.value = false;
    };
    return {
      activeLicense,
      licenses,
      boxVisible,
      showLicenseBox,
      studentName,
      chooseLicense,
    };
  },
};
</script>

<style lang="scss" scoped>
.lcs-view {
  position: relative;
  .active-lcs {
    margin: 0;
    height: 100%;
  }
  .lcs-label {
    padding: 0.5rem 1rem;
    display: inline-block;
    white-space: nowrap;
    color: #444444;
    background-color: white;
    border-radius: 2rem;
    cursor: pointer;
    user-select: none;
  }
  .lcs-list {
    position: absolute;
    top: 100%;
    right: 0;
    padding: 2px;
    background-color: white;
    box-shadow: rgb(0 0 0 / 5%) 0px 0px 0px 1px,
      rgb(209 213 219) 0px 0px 0px 1px inset;
    z-index: 5;
  }
}
</style>

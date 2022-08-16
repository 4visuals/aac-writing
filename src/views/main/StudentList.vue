<template>
  <div class="stud-list">
    <div
      class="license"
      :class="{ active: isActiveLicense(lcs), enabled: hasStudent(lcs) }"
      v-for="lcs in licenses"
      :key="lcs.seq"
      @click="setActiveLicense(lcs)"
    >
      <SpanText class="name">{{ studentName(lcs) }}</SpanText
      ><template v-if="isActiveLicense(lcs)">
        <div class="cate" v-if="hasStudent(lcs)">
          <AacButton
            text="단계별"
            fill
            size="xs"
            theme="pink"
            @click="$emit('selected', lcs, '/level')"
          />
          <AacButton
            text="교과서"
            fill
            size="xs"
            theme="orange"
            @click="$emit('selected', lcs, '/book')"
          />
        </div>
        <AacButton
          v-else
          text="학생 등록"
          fill
          size="xs"
          theme="blue"
          @click="$emit('register', lcs)"
        />
      </template>
    </div>
    <!-- <select>
      <option>[학생 선택]</option>
      <option v-for="stud in students" :key="stud.seq">
        {{ stud.name }}
      </option>
    </select> -->
  </div>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { SpanText } from "../../components/text";
import AacButton from "../../components/form/AacButton.vue";
export default {
  components: {
    SpanText,
    AacButton,
  },
  setup() {
    const store = useStore();

    const students = computed(() => store.getters["user/students"]);
    const licenses = computed(() => store.state.user.membership.licenses);

    const activeLcs = ref(null);

    const studentName = (lcs) => {
      const student = students.value.find((s) => s.seq === lcs.studentRef);
      return student ? student.name : "[미등록]";
    };
    const setActiveLicense = (lcs) => {
      activeLcs.value = lcs;
    };
    const isActiveLicense = (lcs) => lcs === activeLcs.value;

    const hasStudent = (lcs) => {
      const student = students.value.find((s) => s.seq === lcs.studentRef);
      return !!student;
    };
    return {
      activeLcs,
      students,
      licenses,
      studentName,
      setActiveLicense,
      isActiveLicense,
      hasStudent,
    };
  },
};
</script>

<style lang="scss" scoped>
.stud-list {
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  max-height: 400px;
  overflow-y: auto;
  .license {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    column-gap: 16px;
    color: #aaa;
    cursor: pointer;
    height: 50px;
    .name {
      flex: 1 1 auto;
    }
    .cate {
      display: flex;
      column-gap: 8px;
    }
    &.enabled {
      color: black;
    }
    &.active {
      background-color: #e7f3ff;
    }
  }
}
</style>

<template>
  <div class="stud-list">
    <div
      class="license"
      :class="{
        active: isActiveLicense(lcs),
        enabled: hasStudent(lcs),
        expired: isExpiredLicense(lcs),
      }"
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
            theme="gold"
            @click="$emit('selected', lcs, '/book')"
          />
          <div class="gutter"></div>
          <ActionIcon
            class="config"
            icon="settings"
            @click="$emit('register', lcs)"
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
import ActionIcon from "../../components/form/ActionIcon.vue";
export default {
  components: {
    SpanText,
    ActionIcon,
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

    const isExpiredLicense = (lcs) => {
      return lcs.expiredAt && lcs.expiredAt <= new Date().getTime();
    };
    return {
      activeLcs,
      students,
      licenses,
      studentName,
      setActiveLicense,
      isActiveLicense,
      hasStudent,
      isExpiredLicense,
    };
  },
};
</script>

<style lang="scss" scoped>
.stud-list {
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  max-height: 300px;
  overflow-y: auto;
  .license {
    display: flex;
    align-items: center;
    padding: 8px 8px 8px 16px;
    column-gap: 16px;
    color: #aaa;
    cursor: pointer;
    height: 50px;
    .name {
      flex: 1 1 auto;
    }
    .cate {
      display: flex;
      column-gap: 4px;
      .gutter {
        width: 1px;
        margin: 6px 4px 10px 6px;
        background-color: #83c0d6;
      }
      .config {
        font-size: 18px;
        padding: 4px;
        color: #036192;
      }
    }
    &.enabled {
      color: black;
    }
    &.active {
      background-color: #bcedff;
      box-shadow: 0 0 8px #586d748a;
    }
  }
}
</style>

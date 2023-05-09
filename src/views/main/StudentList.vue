<template>
  <div class="stud-list">
    <div v-if="licenses.length === 0" class="no-lcs">
      <h3>이용권이 없습니다</h3>
      <div>
        <AppButton
          text="이용권 구매"
          fill
          size="sm"
          theme="blue"
          borderColor="#4b7bec"
          @click="$router.push('/purchase')"
        />
        <AppButton
          text="마이 페이지"
          fill
          size="sm"
          theme="yellow"
          borderColor="#ffd110"
          @click="$router.push('/setting')"
        />
      </div>
    </div>
    <div
      class="license"
      :class="{
        active: isActiveLicense(lcs),
        enabled: hasStudent(lcs),
        expired: isExpiredLicense(lcs),
      }"
      v-for="lcs in licenses"
      :key="lcs.seq"
      @mouseover="setActiveLicense(lcs)"
      @click="setActiveLicense(lcs)"
    >
      <SpanText class="name">{{ studentName(lcs) }}</SpanText
      ><template v-if="isActiveLicense(lcs)">
        <div class="cate" v-if="hasStudent(lcs)">
          <AppButton
            text="단계별"
            fill
            size="sm"
            theme="blue"
            borderColor="#4b7bec"
            @click="$emit('selected', lcs, '/level')"
          />
          <AppButton
            text="교과서"
            fill
            size="sm"
            borderColor="#ffd110"
            theme="yellow"
            @click="$emit('selected', lcs, '/book')"
          />
          <ActionIcon
            class="config"
            icon="settings"
            @click="$emit('register', lcs)"
          />
        </div>
        <AppButton
          v-else
          text="학생등록"
          size="sm"
          theme="purple"
          fill
          borderColor="#7b4799"
          @click="$emit('register', lcs)"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { SpanText } from "../../components/text";
import ActionIcon from "../../components/form/ActionIcon.vue";
import AppButton from "../../components/form/AppButton.vue";
export default {
  components: {
    SpanText,
    ActionIcon,
    AppButton,
  },
  setup() {
    const store = useStore();

    const students = computed(() => store.getters["user/students"]);
    const licenses = computed(() =>
      store.state.user.membership.licenses.filter((lcs) => lcs.isAvailable())
    );

    const activeLcs = ref(null);

    const studentName = (lcs) => {
      const student = students.value.find((s) => s.seq === lcs.studentRef);
      return student ? student.name : "미등록";
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
  background-color: white;
  max-height: 300px;
  overflow-y: auto;
  .no-lcs {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 16px;
    padding: 16px 0;
    & > div {
      display: flex;
      justify-content: center;
      column-gap: 16px;
    }
  }
  .license {
    display: flex;
    align-items: center;
    padding: 8px 8px 8px 16px;
    column-gap: 16px;
    color: #000;
    font-weight: 600;
    cursor: pointer;
    height: 50px;
    .name {
      flex: 1 1 auto;
    }
    .cate {
      display: flex;
      column-gap: 12px;
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
      background-color: #b4dcf9;
    }
  }
}
</style>

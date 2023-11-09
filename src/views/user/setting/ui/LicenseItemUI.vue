<template>
  <div
    class="license normal"
    :class="{
      expired: license.isExpired(),
    }"
  >
    <!-- <h5>{{ license.uuid }}</h5> -->
    <div class="dates">
      <div class="date">구매일: {{ toYMD(license.createdAt) }}</div>
      <div class="date">시작일: {{ toYMD(license.activatedAt) }}</div>
      <div class="date">종료일: {{ toYMD(license.expiredAt) }}</div>
    </div>
    <div class="assigned">
      <span v-if="assignee" class="student"
        ><span class="name">{{ assignee.name }}</span></span
      >
      <button v-else @click="$emit('clicked', license)" class="nude blue round">
        학생 등록
      </button>
    </div>
    <div v-if="license.isExpired()" class="purchase">
      <p>만료된 수강증입니다. 구매 후 계속해서 학습을 진행할 수 있습니다.</p>
      <button class="nude blue">수강증 구매</button>
    </div>
    <div class="newlcs" v-if="license.isNew">NEW</div>
    <div class="status">
      <div v-if="license.isExpired()" class="item expired">사용 완료</div>
      <div v-if="license.trialVersion" class="item trial">평가판</div>
      <div v-else class="item purchased">
        {{ license.durationInHours / 24 }}일
      </div>
    </div>
  </div>
</template>

<script>
import { time } from "@/service/util";
import { ref, watch } from "@vue/runtime-core";
import { useStore } from "vuex";
export default {
  props: ["license", "current", "mode", "size"],
  setup(props) {
    const UNLIMITED = 24 * 365 * 10;
    const store = useStore();
    const assignee = ref(null);
    const vMode = ref(props.mode || "normal");
    const remaining = (lcs) => {
      const exp = Date.parse(lcs.expiredAt);
      if (lcs.durationInHours === UNLIMITED) {
        return "무제한";
      }
      if (exp) {
        const base = props.current.getTime();
        if (exp - base > 0) {
          return time.diff(props.current, exp);
        } else {
          return "만료됨";
        }
      } else {
        return "무제한";
      }
    };
    const resolveWidth = (lcs) => {
      const totalMillis = lcs.durationInHours * 60 * 60 * 1000;
      if (
        totalMillis === 0 ||
        Number.isNaN(lcs.activatedAt) ||
        lcs.durationInHours === UNLIMITED
      ) {
        // 무제한 이용권(가입시 발급된 라이선스, totalMillis: 0)
        // 또는
        // 아직 사용 안했음(not activated)
        return "100%";
      } else {
        const remaining = lcs.expiredAt - props.current;
        return `${(100 * remaining) / totalMillis}%`;
      }
    };
    const toYMD = (dateFormat) =>
      dateFormat ? time.toYMD(Date.parse(dateFormat)) : "없음";
    const findStudent = () => {
      const { license } = props;
      if (license.studentRef) {
        assignee.value = store.getters["user/students"].find(
          (stud) => stud.seq === license.studentRef
        );
      } else {
        assignee.value = null;
      }
    };
    watch(props.license, findStudent, { immediate: true });
    return { vMode, assignee, remaining, resolveWidth, toYMD };
  },
};
</script>

<style lang="scss" scoped>
.license {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
  gap: 10px;
  max-width: 600px;

  cursor: pointer;
  position: relative;
  margin-bottom: 8px;
  font-size: 1.35rem;

  .ticket {
    font-size: 16px;
    padding: 4px 8px;
  }
  .assigned {
    user-select: none;
    position: relative;
    display: flex;
    .remaining {
      flex: 0 0;
      white-space: nowrap;
    }
    .student {
      flex: 1 1 auto;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background: #ffffff;
      border: 1px solid #828282;
      border-radius: 21px;
      padding: 4px 8px;
    }
  }
  .newlcs {
    color: #fff9ac;
    background-color: crimson;
    position: absolute;
    top: 50%;
    right: 4px;
    transform: translateY(-50%);
    font-size: 9px;
    border-radius: 4px;
    padding: 1px 3px;
  }
  & .active {
    border-color: #4d3d06; // #096c86;
  }
  &.expired {
    background-color: #e1e1e1;
  }
  .purchase {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 8px;
    width: 100%;
    & > button {
      border-radius: 28px;
    }
  }
  .status {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    font-size: 14px;
    font-weight: 600;
    color: white;
    border-radius: 8px;
    border-bottom-right-radius: 0;
    overflow: hidden;
    .item {
      padding: 8px;
      &.expired {
        background-color: #898989;
      }
      &.trial {
        background-color: #4b7bec;
      }
      &.purchased {
        background-color: #e23c3c;
      }
    }
  }
}
</style>

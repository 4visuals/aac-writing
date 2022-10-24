<template>
  <div class="policy">
    <div class="meta">
      <h3>약관</h3>
      <select v-model="typeRef">
        <option v-for="policy in policies" :key="policy.type" :value="policy">
          {{ policy.text }}
        </option>
      </select>
      <div v-if="activePolicy" class="ctrl">
        <div class="created">생성일: {{ ymd(activePolicy.creationTime) }}</div>
        <div class="activated">발효일: {{ activePolicy.activatedAt }}</div>
        <button v-if="editing" class="nude red" @click="cancelEditing">
          취소
        </button>
        <button v-else class="nude blue" @click="startEditing(activePolicy)">
          편집
        </button>
      </div>
    </div>

    <PolicyEditor
      v-if="activePolicy"
      :policy="activePolicy"
      :editing="editing"
      @update="updatePolicy"
    />
  </div>
</template>

<script>
import { ref, watch } from "vue";
import PolicyEditor from "./policy/PolicyEditor.vue";
import api from "../../../service/api";
import { time } from "../../../service/util";
import toast from "@/components/toast";

export default {
  components: { PolicyEditor },
  setup() {
    const policies = [
      { type: "NONE", text: "[약관 선택]", dummy: true },
      { type: "TM", text: "서비스 이용 약관" },
      { type: "PV", text: "개인정보 보호 정책" },
    ];
    const typeRef = ref(policies[0]);
    const editing = ref(false);
    const activePolicy = ref(null);

    const loadPolicies = (policy) => {
      if (policy.dummy) {
        return;
      }
      api.policy.listBy(policy.type).then((res) => {
        activePolicy.value = res.policies[0];
      });
    };
    const ymd = (t) => time.toYMD(t);
    const startEditing = () => {
      editing.value = true;
    };
    const cancelEditing = () => {
      if (confirm("약관 편집을 취소합니까?")) {
        editing.value = false;
      }
    };
    const updatePolicy = (newPolicy) => {
      // const detail = e.detail;
      // console.log(detail);
      if (!newPolicy.activatedAt) {
        // alert("활성 시간을 지정해주세요");
        toast.error("발효 시간이 없습니다.", null, 5);
        return;
      }
      api.policy.update(activePolicy.value.seq, newPolicy).then((res) => {
        console.log(res);
        activePolicy.value = res.policy;
        editing.value = false;
        toast.success("[성공] 새로운 약관 등록", null, 3);
      });
    };
    watch(typeRef, (policy) => {
      loadPolicies(policy);
    });
    return {
      typeRef,
      policies,
      activePolicy,
      editing,
      loadPolicies,
      ymd,
      startEditing,
      cancelEditing,
      updatePolicy,
    };
  },
};
</script>

<style lang="scss" scoped>
.policy {
  .meta {
    position: sticky;
    top: 0;
    background-color: #fffdf4;
    padding-bottom: 8px;
    border-bottom: #0000004d 1px solid;
    .ctrl {
      display: flex;
      column-gap: 16px;
      align-items: center;
    }
  }
}
</style>

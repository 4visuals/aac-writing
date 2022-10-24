<template>
  <div class="editor">
    <TabView v-if="editing" :model="tabModel" />
    <div class="tab-body">
      <PolicyView v-if="preview || !editing" :mdText="detail" />
      <div v-else class="form">
        <input
          type="date"
          :min="policy.activatedAt"
          @change="updateActivationTime"
        />
        <textarea class="detail" v-model="detail"></textarea>
        <button class="nude blue" @click="updatePolicy">약관 업데이트</button>
      </div>
    </div>
  </div>
</template>

<script>
import { marked } from "marked";
// import { time } from "@/service/util";
import { ref, shallowRef, watch } from "vue";
import { TabModel, TabView } from "@/components/tab";
import { PolicyView } from "@/components/policy";

export default {
  props: ["policy", "editing"],
  components: {
    TabView,
    PolicyView,
  },
  setup(props, { emit }) {
    const detail = shallowRef("" + props.policy.detail);
    // const minRef = props.policy.activatedAt;
    const activationTime = shallowRef(null);
    const preview = ref(false);
    const tabModel = TabModel.create([
      { text: "편집", cmd: "edit", clazz: "edit" },
      { text: "미리보기", cmd: "preview", clazz: "preview" },
    ]);
    const getDetail = () => {
      if (preview.value) {
        return marked.parse(detail.value);
      } else {
        return marked.parse(props.policy.detail);
      }
    };
    const updateActivationTime = (e) => {
      console.log(e.target.value);
      activationTime.value = e.target.value;
    };
    const updatePolicy = () => {
      emit("update", {
        detail: detail.value,
        activatedAt: activationTime.value,
        policyType: props.policy.policyType,
      });
    };
    watch(
      () => props.editing,
      (editing) => {
        if (editing) {
          detail.value = "" + props.policy.detail;
        }
        tabModel.setActiveAt(0);
        preview.value = false;
        detail.value = "" + props.policy.detail;
      }
    );
    watch(tabModel.activeTab, (tab) => {
      preview.value = tab.cmd === "preview";
    });
    watch(
      () => props.policy,
      (policy) => {
        detail.value = policy.detail;
      }
    );
    return {
      detail,
      preview,
      tabModel,
      getDetail,
      updatePolicy,
      updateActivationTime,
    };
  },
};
</script>

<style lang="scss" scoped>
.editor {
  padding: 8px;
  max-width: 720px;
  background-color: #fffbec;
  .detail {
    width: 100%;
    padding: 8px;
  }
  textarea {
    height: 300px;
    font-size: 1.2rem;
  }
}
</style>

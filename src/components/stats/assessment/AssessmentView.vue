<template>
  <section>
    <header>
      <ActionIcon fsize="18px" icon="arrow_back" @click="$emit('close')" />
      <h3>{{ activeAsignee.student.name }}</h3>
      <div class="pad"></div>
      <select v-model="activeAsignee">
        <option
          v-for="asn in assignees"
          :key="asn.student.seq"
          :selected="asn.student.seq === activeAsignee?.student.seq"
          :value="asn"
        >
          {{ asn.student.name }}
        </option>
      </select>
    </header>
    <div class="content">
      <TabView :model="tabModel"></TabView>
      <div class="tab-body">
        <div v-if="activeTab.cmd === 'survey0'" class="survey">
          <AssessmentForm
            type="before"
            :diagnosis="diagnosisRef.before"
            @answer="pushAnswer"
            @commit="commitDiagnosis"
          />
        </div>
        <div v-else-if="activeTab.cmd === 'history'" class="survey">
          <AssessmentStatView :exams="diagnosisRef.exams" />
        </div>
        <div v-else-if="activeTab.cmd === 'survey1'" class="survey">
          <AssessmentForm
            type="after"
            :diagnosis="diagnosisRef.after"
            @answer="pushAnswer"
            @commit="commitDiagnosis"
          />
        </div>
        <div v-else>Error</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import ActionIcon from "@/components/form/ActionIcon.vue";
import AssessmentStatView from "./AssessmentStatView.vue";
import AssessmentForm from "./AsessmentForm.vue";
import { TabModel, TabView } from "@/components/tab";
import { defineProps, reactive, shallowRef, watch } from "vue";
import { StudentExamList } from "./exam-paper.js";
import api from "../../../service/api";

const props = defineProps(["assignees", "student", "license"]);
const activeAsignee = shallowRef(
  props.assignees.find((ans) => ans.student.seq === props.student.seq)
);
const tabModel = TabModel.create([
  { text: "진단평가", cmd: "survey0", clazz: "retail" },
  { text: "학습이력", cmd: "history", clazz: "gbuying" },
  { text: "종합평가", cmd: "survey1", clazz: "gbuying" },
]);
const { activeTab } = tabModel;
const diagnosisRef = reactive({
  before: {
    questions: undefined,
    ready: false,
  },
  after: {
    questions: undefined,
    ready: false,
  },
  exams: undefined,
});

const pushAnswer = (e) => {
  const { student } = props;
  const { answer, quiz } = e;
  if (!answer || answer.trim().length === 0) {
    return;
  }
  api.diagnosis.put(student.seq, quiz.seq, answer).then((answer) => {
    /* changes are visible to <AssessmentForm /> */
    quiz.answer = answer;
  });
};
const updateDiagnosis = () => {
  const { student } = activeAsignee.value;
  api.student.getDiagnosis(student.seq).then((res) => {
    const { diagnosis, exams } = res;
    diagnosisRef.before.questions = diagnosis.v1;
    diagnosisRef.before.ready = diagnosis.v1Ready;
    diagnosisRef.after.questions = diagnosis.v2;
    diagnosisRef.after.ready = diagnosis.v2Ready;
    diagnosisRef.exams = StudentExamList.parse(exams);
  });
};
const commitDiagnosis = (e) => {
  const { type } = e;
  const diagnosis = diagnosisRef[type];
  if (!diagnosis) {
    throw new Error("invalid type: " + type);
  }
  const version = type === "before" ? "2024_v1" : "2024_v2";
  api.diagnosis.commit(props.student.seq, version).then(() => {
    diagnosis.ready = true;
  });
};
watch(activeAsignee, updateDiagnosis, { immediate: true });
</script>

<style lang="scss" scoped>
section {
  height: 100%;
  display: flex;
  flex-direction: column;
  header {
    padding: 16px;
    display: flex;
    h3 {
      margin-left: 16px;
    }
    .pad {
      flex: 1 1 auto;
    }
  }
  .content {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    padding: 0 16px;
    .tab-body {
      flex: 1 1 auto;
      padding-top: 16px;
      .survey {
        height: 100%;
        padding-bottom: 16px;
      }
    }
  }
}
</style>

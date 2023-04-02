<template>
  <div class="sms-form">
    <h3>
      <AppIcon
        v-if="activeForm"
        icon="arrow_left"
        @click="activeForm = udefined"
      />
      <span v-if="activeForm" class="title">{{ activeForm.title }}</span
      ><span v-else class="title">주문 안내 문자</span>
    </h3>
    <div v-if="activeForm" class="form">
      <component :is="activeForm.component" :order="order" />
    </div>
    <div v-else class="sms-types">
      <div v-for="form in formTypes" :key="form.templateId" class="form">
        <button class="nude blue" @click="activeForm = form">
          {{ form.title }}
        </button>
        <p>{{ form.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { SmsFormType } from "./sms";
import PaperNotificationForm from "./PaperNotificationForm.vue";
import LicenseNotificationForm from "./LicenseNotificationForm.vue";

export default {
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const formTypes = [
      new SmsFormType(
        "paper-notif",
        "필요 서류 통보",
        "주문 관련 서류를 이메일로 전송한 후 문자를 보냅니다.",
        PaperNotificationForm
      ),
      new SmsFormType(
        "license-notif",
        "이용권 발급 통보",
        "입금 확인 및 이용권 발급 후 문자를 보냅니다.",
        LicenseNotificationForm
      ),
    ];
    const activeForm = ref(null);

    return { formTypes, activeForm };
  },
};
</script>

<style lang="scss" scoped>
.sms-form {
  padding: 16px;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}
</style>

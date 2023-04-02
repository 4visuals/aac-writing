<template>
  <div>
    <GroupOrderSenderView :order="order" :hidden="['content']" />
    <GroupOrderOrgView :order="order" />
    <div class="preview">
      <h5>문자 미리보기</h5>
      <p class="sms-body">
        {{ preview }}
      </p>
      <p class="bytes">
        <span>{{ preview.length }}글자 / 최대 70글자</span
        ><span v-if="preview.length > 70" class="alert"
          >70글자가 넘으면 잘릴 수 있음.</span
        >
      </p>
      <button class="nude blue" @click="sendOrderPaperSms">바로 전송</button>
    </div>
  </div>
</template>

<script>
import GroupOrderSenderView from "../GroupOrderSenderView.vue";
import GroupOrderOrgView from "../GroupOrderOrgView.vue";
import adminApi from "../../service/admin-api";
import { onMounted, ref } from "vue";
import toast from "@/components/toast";
export default {
  components: { GroupOrderSenderView, GroupOrderOrgView },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const templateName = "paper";
    const { group } = adminApi.order;
    const preview = ref("");
    const previewSms = () => {
      group.sms.preview(props.order.orderUuid, templateName).then((res) => {
        preview.value = res.sms;
      });
    };
    const sendOrderPaperSms = () => {
      group.sms
        .send(props.order.orderUuid, templateName)
        .then(() => {
          toast.success("문자 전송 완료", "[성공]");
        })
        .catch((e) => {
          toast.success(`문자 전송 실패 [${e.cause}]`, "[실패]");
        });
    };

    onMounted(() => {
      previewSms();
    });
    return { preview, sendOrderPaperSms };
  },
};
</script>

<style lang="scss" scoped>
.preview {
  margin-top: 16px;
  h5 {
    font-size: 18px;
    margin-bottom: 6px;
  }
  p {
    &.sms-body {
      background-color: #dff8ff;
      padding: 8px;
      font-size: 16px;
    }
    span.alert {
      color: #ba0000;
      margin-left: 8px;
    }
  }
}
</style>

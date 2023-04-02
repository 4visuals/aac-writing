<template>
  <div class="elem">
    <h5>요청인</h5>
    <p class="col2">
      <span clas="lbl">문의시간</span
      ><span class="val">{{ order.creationTimeKr }}</span>
    </p>
    <p class="col2">
      <span clas="lbl">이름</span><span>{{ user.name }}</span>
    </p>
    <p class="col2">
      <span clas="lbl">이메일</span><span>{{ user.email }}</span>
    </p>
    <p class="col2">
      <span clas="lbl">연락처</span
      ><span v-if="order.senderContactInfo">{{ order.senderContactInfo }}</span
      ><span v-else>미입력</span>
    </p>
    <textarea v-if="isVisible('content')" :value="order.content">{{}}</textarea>
  </div>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      required: true,
    },
    hidden: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const isVisible = (prop) => {
      return !props.hidden.find((p) => p === prop);
    };
    return { user: props.order.sender, isVisible };
  },
};
</script>

<style lang="scss" scoped>
.elem {
  font-weight: 300;
  h5 {
    font-size: 18px;
    margin-bottom: 6px;
  }
  p {
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 4px;
    &.col2 {
      display: grid;
      grid-template-columns: minmax(80px, 120px) 1fr;
      grid-template-rows: auto;
    }
    .paper {
      display: flex;
      column-gap: 8px;
      color: #3a3a3a;
      font-weight: 500;
    }
  }
  textarea {
    width: 100%;
    padding: 6px;
    border: none;
    background-color: #dff8ff;
    font-size: 14px;
    margin-top: 8px;
    &:focus {
      outline: #92bbff 1px solid;
    }
  }
  .btn-purchase {
    font-size: 18px;
  }
}
</style>

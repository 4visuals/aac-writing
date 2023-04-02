<template>
  <div class="elem">
    <h5>기관 정보</h5>
    <p class="col2">
      <span clas="lbl">기관명</span>
      <span v-if="order.orgName">{{ order.orgName }}</span
      ><span v-else>미입력</span>
    </p>
    <p class="col2">
      <span clas="lbl">기관 이메일</span>
      <span v-if="order.orgEmail">{{ order.orgEmail }}</span
      ><span v-else>미입력</span>
    </p>
    <p class="col2">
      <span class="lbl">필요서류</span>
      <span class="paper"
        ><span v-for="(paper, idx) in order.papers" :key="idx">{{
          paper.desc
        }}</span></span
      >
    </p>
  </div>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {};
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

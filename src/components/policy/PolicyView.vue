<template>
  <div class="detail" :style="{ padding: padding }">
    <div v-if="controlVisible" class="close">
      <AppButton text="닫기" :fill="true" @click="$emit('close')" />
    </div>
    <div class="content" v-html="getDetail()"></div>
  </div>
</template>

<script>
import { marked } from "marked";
export default {
  props: {
    mdText: {
      type: String,
      require: true,
    },
    padding: {
      type: String,
      default: "0",
    },
    controlVisible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const getDetail = () => {
      return marked.parse(props.mdText);
    };
    return { getDetail };
  },
};
</script>

<style lang="scss" scoped>
.container-fluid {
  background-color: #fffdf4;
}
.detail {
  position: relative;
  .close {
    position: sticky;
    top: 16px;
    background-color: inherit;
  }
  h1 {
    margin-top: 2rem;
  }
  h2 {
    margin-top: 1.3rem;
    font-weight: 600;
    font-size: 1.3rem;
  }
  h3 {
    font-size: 1.15rem;
    font-weight: 600;
    margin-top: 1rem;
  }
  p {
    margin-top: 0.75rem;
    margin-bottom: 14px;
  }
  ul {
    margin: 1rem 0;
  }
}
</style>

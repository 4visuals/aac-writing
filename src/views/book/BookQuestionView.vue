<template>
  <div class="overview">
    <div v-for="slice in slices" :key="slice.title" class="q-slice">
      <h5>
        <SpanText class="title">{{ slice.title }}</SpanText>
      </h5>
      <div class="sentences">
        <div v-for="sen in slice.questions" :key="sen.seq" class="sen">
          <SpanText class="num">{{ pad(sen.numberInSection + 1) }}.</SpanText>
          <SpanText class="text"> {{ sen.sentence }}</SpanText>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import util from "@/service/util";
import { SpanText } from "../../components/text";
class QuestionSlice {
  constructor(title, questions) {
    this.title = title;
    this.questions = questions;
  }
}
export default {
  props: {
    section: {
      type: Object,
    },
  },
  setup(props) {
    const slices = reactive([]);
    const pad = (num) => {
      return num < 10 ? "0" + num : "" + num;
    };
    const splitSentences = () => {
      const { sentences } = props.section;
      /**
       * 교과서/섹션 들은 10,20,30개 단위로 구성됨
       */
      for (let k = 0; k < sentences.length; k += 10) {
        const title = `${k + 1} ~ ${k + 10}`;
        const sliced = sentences.slice(k, k + 10);
        slices.push(new QuestionSlice(title, sliced));
      }
      /**
       * 종합: 랜덤하게 채워넣음.
       */
      slices.push(new QuestionSlice("종합", util.pick(sentences, 10)));
    };
    splitSentences();
    return {
      slices,
      pad,
    };
  },
  components: { SpanText },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
$gap: 16px;
.overview {
  position: absolute;
  overflow: auto;
  inset: 0;
  display: grid;
  gap: $gap;
  padding: $gap;
  background-color: white;
  color: #865900;
  .q-slice {
    background-color: #fffad5;
    padding: 8px;
    border-radius: 8px;
    .title {
      border: 1px solid #865900;
      padding: 6px 12px;
      border-radius: 2rem;
      display: inline-flex;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .sentences {
      .sen {
        margin-left: 8px;
        .num {
          margin-right: 4px;
        }
      }
    }
  }
  @include mobile {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }
  @include tablet {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }
  @include desktop {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }
}
</style>

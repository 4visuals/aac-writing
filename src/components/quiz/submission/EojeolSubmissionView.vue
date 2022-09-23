<template>
  <div class="sbm-view">
    <div class="sbm" v-for="sen in submit.sentences" :key="sen.seq">
      <div class="sen">
        <SpanText size="sm" class="mark q">Q</SpanText
        ><SpanText size="sm">{{ sen.sentence }}</SpanText>
      </div>
      <div class="eojeols">
        <div class="eojeol" v-for="eojeol in sen.eojeols" :key="eojeol.seq">
          <div
            class="pic ej"
            :style="{
              'background-image': `url('${imagePathOfEojeol(eojeol)}')`,
            }"
          ></div>
          <div
            class="val"
            :class="{ correct: answer.correct }"
            v-for="answer in answerOf(eojeol)"
            :key="answer.index"
          >
            {{ answer.value }}
          </div>
          <div class="empty" v-if="isEmptyEojeol(eojeol)">미입력</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from "@/service/util";
import { SpanText } from "@/components/text";
import { shallowRef } from "vue";
export default {
  components: {
    SpanText,
  },
  props: ["paper", "section"],
  setup(props) {
    const submit = shallowRef(null);

    const answerOf = (ej) => {
      const { groups } = submit.value;
      const senSeq = "" + ej.sentenceRef;
      if (!groups[senSeq]) {
        return [];
      }
      return groups[senSeq][ej.eojeolRef] || [];
    };

    const imagePathOfEojeol = (ej) => {
      return util.path.resolveUrl(ej.picturePath);
    };
    const isEmptyEojeol = (ej) => {
      const { groups } = submit.value;
      const senSeq = "" + ej.sentenceRef;
      if (!groups[senSeq]) {
        return true;
      }
      const answers = groups[senSeq][ej.eojeolRef];
      return !answers || answers.length === 0;
    };
    const buildData = () => {
      const { section, paper } = props;
      const { questionOffset: offset, numOfQuestions: size } = paper;
      // 1. section내에서 낱말과 문장을 따로 분리
      const sentences = section.sentences
        .filter((sen) => sen.type === paper.type)
        .slice(offset, offset + size);
      const groups = util.arr.unflat(paper.submissions, {}, (sbm) => [
        sbm.sentenceRef,
        sbm.eojeolRef,
      ]);
      submit.value = { sentences, groups };
    };
    buildData();
    return { submit, answerOf, imagePathOfEojeol, isEmptyEojeol };
  },
};
</script>

<style lang="scss" scoped>
.sbm-view {
  .sbm {
    padding: 0 8px 8px;
    .pic {
      background-color: #efefef;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      grid-column: 1/2;
      grid-row: 1/3;
      border-radius: 4px;
      box-shadow: 1px 1px 2px #0000004f;
      &.ej {
        width: 48px;
        height: 48px;
        margin-bottom: 4px;
      }
    }
    .mark {
      font-family: "Rowdies", monospace, cursive;
      font-weight: 500;
      &.q {
        margin-right: 4px;
        color: #0596ff;
      }
      &.a {
        color: rgb(0, 190, 0);
      }
    }
    .eojeols {
      display: flex;
      column-gap: 4px;
      .eojeol {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .val {
          padding: 1px 2px 1px 4px;
          border-left: 1px solid #777;
          background-color: #efefef;
          color: #777;
          width: 100%;
          &.correct {
            border-left-color: #335f0b;
            background-color: #b3ff70;
            color: #335f0b;
          }
        }
        .empty {
          padding-left: 5px;
          color: #777;
        }
      }
    }
  }
}
</style>

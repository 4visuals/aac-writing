<template>
  <div class="sbm-view">
    <div class="perfect" v-if="submit.sentences.length === 0">100점</div>
    <div class="sbm" v-for="sen in submit.sentences" :key="sen.seq">
      <div class="sen">
        <SpanText>{{ sen.sentence }}</SpanText>
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
            v-for="answer in answerOf(eojeol)"
            class="val"
            :class="{ correct: answer.correct }"
            :key="answer.index"
          >
            <SpanText size="sm">{{ answer.value }}</SpanText>
          </div>
          <div class="none val" v-if="isEmptyEojeol(eojeol)">미입력</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from "@/service/util";
import { SpanText } from "@/components/text";
import { onMounted, shallowRef, watch } from "vue";
export default {
  components: {
    SpanText,
  },
  props: ["paper", "section"],
  setup(props, { emit }) {
    const image = {
      passed: require("@/assets/reward/face-green.svg"),
      failed: require("@/assets/reward/face-red.svg"),
      none: require("@/assets/reward/face-gray.svg"),
    };
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
      const answers = answerOf(ej);
      if (answers.length === 0) {
        return image.none;
      } else if (answers.length === 1 && answers[0].correct) {
        return image.passed;
      } else {
        return image.failed;
      }
      // return util.path.resolveUrl(ej.picturePath);
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
      const groups = util.arr.unflat(paper.submissions, {}, (sbm) => [
        sbm.sentenceRef,
        sbm.eojeolRef,
      ]);
      /**
       *  문장마다 다음과 같은 구조
       * {
       *   문장: { ... },
       *   문장: {
       *     어절: [오답,오답, 정답],
       *     어절: [오답,오답, 정답],
       *     ...
       *   }
       * }
       */
      Object.keys(groups).forEach((senSeq) => {
        Object.keys(groups[senSeq]).forEach((eojeolSeq) => {
          /** @type {any[]} */
          const inputs = groups[senSeq][eojeolSeq];
          inputs.splice(1);
        });
      });
      submit.value = { groups };
      // 1. section내에서 낱말과 문장을 따로 분리
      const sentences = section.sentences
        .filter((sen) => sen.type === paper.type)
        .slice(offset, offset + size)
        .filter((sen) => {
          const ejSize = sen.eojeols.length;
          const corrects = sen.eojeols.filter((ej) => {
            const answers = answerOf(ej);
            return answers.length > 0 && answers[0].correct;
          }).length;
          return ejSize !== corrects;
        });
      submit.value.sentences = sentences;
    };
    buildData();
    watch(() => props.paper, buildData);
    onMounted(() => {
      const { sentences } = submit.value;
      if (sentences.length === 0) {
        emit("perfect");
      }
    });
    return { submit, answerOf, imagePathOfEojeol, isEmptyEojeol };
  },
};
</script>

<style lang="scss" scoped>
.sbm-view {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  padding: 0 16px;
  .perfect {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 48px;
    font-weight: 600;
    text-shadow: 4px 4px #453b80;
    color: #298efb;
    transition: font-size 0.2s linear 0.3;
  }
  .sbm {
    display: flex;
    flex-direction: column;
    row-gap: 6px;
    .sen {
      font-weight: 600;
    }
    .pic {
      width: 28px;
      height: 28px;
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
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
        align-items: center;
        .val {
          flex: 1 1 auto;
          border-radius: 8px;
          padding: 0 12px;
          border: 1px solid #df2424;
          color: #df2424;
          display: inline-flex;
          align-items: center;
          &.correct {
            border-color: #54b706;
            color: #54b706;
          }
          &.none {
            border-color: #a5a5a5;
            color: #a5a5a5;
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

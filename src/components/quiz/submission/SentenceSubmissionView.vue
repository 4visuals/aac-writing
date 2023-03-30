<template>
  <div class="sbm-view">
    <AppIcon
      icon="close"
      fsize="24px"
      class="btn-close"
      @click="$emit('close')"
    />
    <ScoreUI v-if="submit.sentences.length === 0" :score="100" />
    <div class="paper-info" v-else>
      <div class="info">
        <h4>
          <span>[{{ rangeText(section.chapter) }}]</span>
          <span>{{ section.chapter.desc.substring(3) }}</span>
        </h4>
        <h5>
          <span>{{ section.getLevelText() + ". " + section.description }}</span>
        </h5>
        <h5>
          <span>{{ quizRangeText() }}</span>
        </h5>
      </div>
      <div class="sbm" v-for="sen in submit.sentences" :key="sen.seq">
        <div class="sen">
          <SpanText>{{ sen.sentence }}</SpanText>
        </div>
        <div class="answer">
          <div
            class="pic"
            :style="{ 'background-image': `url('${imagePath(sen)}')` }"
          ></div>
          <div class="text" v-if="hasSubmissions(sen)">
            <SpanText>{{ filterSubmissions(sen)[0].value }}</SpanText>
          </div>
          <div class="text empty" v-else>미입력</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SpanText } from "@/components/text";
import util from "@/service/util";
import { onMounted, shallowRef, watch } from "vue";
import ScoreUI from "../../stats/ScoreUI.vue";
export default {
  components: { SpanText, ScoreUI },
  props: ["paper", "section"],
  setup(props, { emit }) {
    const image = {
      passed: require("@/assets/reward/face-green.svg"),
      failed: require("@/assets/reward/face-red.svg"),
    };
    const submit = shallowRef(null);

    const filterSubmissions = (sentence) => {
      const submissions = submit.value.groups[sentence.seq];
      return submissions || [];
    };
    const buildData = () => {
      const { section, paper } = props;
      const { questionOffset: offset, numOfQuestions: size } = paper;

      const groups = util.arr.unflat(paper.submissions, {}, (sbm) => [
        sbm.sentenceRef,
      ]);
      submit.value = { groups };
      // 1. section내에서 낱말과 문장을 따로 분리
      const sentences = section.sentences
        .filter((sen) => sen.type === paper.type)
        .slice(offset, offset + size)
        .filter((sen) => {
          const submissions = filterSubmissions(sen);
          if (submissions.length === 0) {
            return true;
          }
          if (!submissions[0].correct) {
            return true;
          }
          return false;
        });

      submit.value.sentences = sentences;
    };

    const hasSubmissions = (sentence) => {
      const submissions = submit.value.groups[sentence.seq];
      return submissions && submissions.length > 0;
    };
    const imagePath = (sentence) => {
      // const imgPath = sentence.scenePicture || sentence.eojeols[0].picturePath;
      const submissions = filterSubmissions(sentence);
      if (submissions.length === 1 && submissions[0].correct) {
        return image.passed;
      } else {
        return image.failed;
      }
    };
    const quizRangeText = () => {
      const { section } = props;
      const { submissions: sbm } = props.paper;
      /**
       * submission이 뒤죽박죽 섞여있다.
       * 맨 앞과 맨 뒤가 문장의 순서와 일치하지 않음.
       * 문장의 순서대로 정렬하고 양 끝의 submission을 사용해야 함.
       */
      sbm.sort((a, b) => a.sentenceRef - b.sentenceRef);

      const sen0 = section.sentences.find(
        (sen) => sen.seq === sbm[0].sentenceRef
      );
      const sen1 = section.sentences.find(
        (sen) => sen.seq === sbm[sbm.length - 1].sentenceRef
      );
      return `[${sen0.numberInSection + 1} ~ ${sen1.numberInSection + 1}]`;
    };
    buildData();
    watch(() => props.paper, buildData);
    onMounted(() => {
      const { sentences } = submit.value;
      if (sentences.length === 0) {
        emit("perfect");
      }
    });
    return {
      submit,
      filterSubmissions,
      hasSubmissions,
      imagePath,
      rangeText: util.chapter.rangeText,
      quizRangeText,
    };
  },
};
</script>

<style lang="scss" scoped>
.sbm-view {
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  position: relative;
  .btn-close {
    z-index: 10;
    position: absolute;
    right: 8px;
    top: 8px;
    cursor: pointer;
  }
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
    row-gap: 4px;
    padding: 0 16px;
    .mark {
      font-family: "Rowdies", monospace, cursive;
      font-weight: 600;
      &.q {
        color: #0596ff;
        text-align: center;
      }
      &.a {
        color: rgb(0, 190, 0);
      }
    }
    .sen {
      color: #666;
      display: inline-flex;
      align-items: center;
      font-weight: 600;
      margin-left: 40px;
    }
    .answer {
      display: flex;
      column-gap: 8px;
      .pic {
        width: 28px;
        height: 28px;
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
      }
      .text {
        flex: 1 1 auto;
        border-radius: 8px;
        padding: 0 12px;
        border: 1px solid #df2424;
        color: #df2424;
        display: inline-flex;
        align-items: center;
      }
      .empty {
        color: #999;
        font-style: italic;
      }
    }
  }
}
</style>

<template>
  <div class="sbm-view">
    <div class="sbm" v-for="sen in submit.sentences" :key="sen.seq">
      <div
        class="pic"
        :style="{ 'background-image': `url('${imagePath(sen)}')` }"
      ></div>
      <div class="sen">
        <SpanText size="sm" class="mark q">Q</SpanText
        ><SpanText size="sm">{{ sen.sentence }}</SpanText>
      </div>
      <div class="answers">
        <ul v-if="hasSubmissions(sen)">
          <li
            v-for="(sbm, idx) in filterSubmissions(sen)"
            :key="idx"
            class="answer"
            :class="{ correct: sbm.correct }"
          >
            <SpanText size="sm">{{ sbm.value }}</SpanText>
          </li>
        </ul>
        <div class="empty" v-else>미입력</div>
      </div>
    </div>
  </div>
</template>

<script>
import { SpanText } from "@/components/text";
import util from "@/service/util";
import { shallowRef, watch } from "vue";
export default {
  components: { SpanText },
  props: ["paper", "section"],
  setup(props) {
    const image = {
      passed: require("@/assets/reward/passed.png"),
      failed: require("@/assets/reward/failed.png"),
    };
    const submit = shallowRef(null);
    const buildData = () => {
      const { section, paper } = props;
      const { questionOffset: offset, numOfQuestions: size } = paper;
      // 1. section내에서 낱말과 문장을 따로 분리
      const sentences = section.sentences
        .filter((sen) => sen.type === paper.type)
        .slice(offset, offset + size);
      const groups = util.arr.unflat(paper.submissions, {}, (sbm) => [
        sbm.sentenceRef,
      ]);
      submit.value = { sentences, groups };
    };
    const filterSubmissions = (sentence) => {
      const submissions = submit.value.groups[sentence.seq];
      return submissions || [];
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
    buildData();
    watch(() => props.paper, buildData);
    return { submit, filterSubmissions, hasSubmissions, imagePath };
  },
};
</script>

<style lang="scss" scoped>
.sbm-view {
  .sbm {
    display: grid;
    grid-template-columns: 60px 1fr;
    grid-template-rows: 24px max-content;
    column-gap: 8px;
    margin: 8px;
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
    .pic {
      width: 60px;
      height: 60px;
      background-color: #efefef;
      background-size: 80%;
      background-position: center;
      background-repeat: no-repeat;
      grid-column: 1/2;
      grid-row: 1/3;
      border-radius: 8px;
      box-shadow: 1px 1px 2px #0000004d;
    }
    .sen {
      color: #666;
      grid-column: 2 / 3;
      display: inline-flex;
      align-items: center;
    }
    .answers {
      grid-column: 2 / 3;
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        column-gap: 8px;
        .answer {
          background-color: #efefef;
          color: #777;
          padding: 4px 6px;
          border-radius: 4px;
          &.correct {
            background-color: #b3ff70;
            color: #335f0b;
          }
        }
      }
      .empty {
        color: #999;
        font-style: italic;
      }
    }
  }
}
</style>

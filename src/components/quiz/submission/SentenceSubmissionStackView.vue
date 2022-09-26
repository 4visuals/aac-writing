<template>
  <div class="sbm-view">
    <div class="sbm">
      <div class="answers">
        <table class="eojeols">
          <tr class="th">
            <th></th>
            <th v-for="(paper, idx) in papers" :key="paper.seq">
              {{ idx + 1 }}회
            </th>
          </tr>
          <tr class="ej" v-for="sen in submit.sentences" :key="sen.seq">
            <td class="q">
              <div
                class="pic"
                :style="{
                  'background-image': `url('${imagePathOfEojeol(
                    sen.eojeols[0]
                  )}')`,
                }"
              ></div>
            </td>
            <td
              class="val"
              v-for="(ans, idx) in answersByEojeol(sen)"
              :key="idx"
              :class="{
                empty: !ans,
                correct: ans?.correct,
                failed: ans && !ans.correct,
              }"
            >
              {{ ans ? ans.value : "없음" }}
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import util from "@/service/util";
import { shallowRef } from "vue";
export default {
  props: ["papers", "sentences"],
  setup(props) {
    const submit = shallowRef(null);
    const imagePathOfEojeol = (ej) => {
      return util.path.resolveUrl(ej.picturePath);
    };
    const answersByEojeol = (sen) => {
      const ej = sen.eojeols[0];
      const { papers } = props;
      const { answers } = submit.value;
      const values = papers.map((paper) => {
        const ans = answers.find((ans) => ans.seq === paper.seq);
        const ejAnswers = ans.groups[ej.sentenceRef];
        return ejAnswers && ejAnswers[0];
      });
      return values;
    };
    const buildData = () => {
      const { papers, sentences } = props;
      const answers = papers.map((paper) => {
        const groups = util.arr.unflat(paper.submissions, {}, (sbm) => [
          sbm.sentenceRef,
        ]);
        return { seq: paper.seq, groups };
      });
      submit.value = { sentences, answers };
    };
    buildData();
    return { submit, answersByEojeol, imagePathOfEojeol };
  },
};
</script>

<style lang="scss" scoped>
.sbm-view {
  .answers {
    .eojeols {
      .th {
        text-align: center;
      }
      .pic {
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: 4px;
        box-shadow: 1px 1px 2px #0000008f;
        width: 28px;
        height: 28px;
        margin: 2px 8px;
      }
      .ej {
        &.head {
          margin-top: 4px;
          td {
            border-top: 8px solid #fff;
            margin-top: 4px;
            &.q {
              border-top-color: transparent;
            }
          }
        }
        .val {
          padding: 4px 6px;
          border-right: 1px solid #ccc;
          color: #aaa;

          &.empty {
            font-size: 0.8rem;
          }
          &.correct {
            color: #276d03;
            background-color: #f4ffe7;
          }
          &.failed {
            color: #a83e25;
            background-color: #fff2e0;
          }
        }
      }
    }
  }
}
</style>

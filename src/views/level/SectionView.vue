<template>
  <div class="section-detail" :class="theme">
    <div class="jumbo">
      <div class="title">
        <h3>{{ title() }}</h3>
        <SwitchButton
          v-model:selected="quizMode"
          onText="퀴즈"
          offText="학습"
        />
      </div>
    </div>
    <div class="body">
      <div class="ko-char-view">
        <ParaText>{{ cate.description }}</ParaText>
        <!--         
        <div class="chars">
          <div class="char-body">
            <Char
              type="chosung"
              :active="isSelected('cho', c)"
              :ch="c"
              v-for="(c, idx) in chosung"
              :key="idx"
            />
          </div>
        </div>
        <div class="chars">
          <div class="char-body">
            <Char
              type="jungsung"
              :active="isSelected('jung', c)"
              :ch="c"
              v-for="(c, idx) in jungsung"
              :key="idx"
            />
          </div>
        </div>
        <div class="chars">
          <div class="char-body">
            <Char
              type="jongsung"
              :ch="c"
              v-for="(c, idx) in jongsung"
              :key="idx"
            />
          </div>
        </div> -->
      </div>
    </div>
    <div class="footer">
      <div class="choose">
        <AacButton
          text="어절학습"
          theme="orange"
          @click="startSentenceQuiz('EJ')"
        />
        <AacButton
          text="문장학습"
          theme="blue"
          @click="startSentenceQuiz('SEN')"
        />
        <AacButton text="낱말학습" theme="blue" @click="startWordQuiz('W')" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import router from "@/router";
import { ParaText } from "@/components/text";
import { SwitchButton } from "@/components/form";
// import { Char } from "@/components";
import { AacButton } from "@/components/form";
import api from "@/service/api";
export default {
  props: ["cate", "theme"],
  components: {
    AacButton,
    ParaText,
    SwitchButton,
    // Char,
  },
  setup(props) {
    const quizMode = ref(true);
    console.log("[cate]", props.cate, props.theme);
    // const chosung = "ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㄲㄸㅃㅆㅉ ".split("");
    // const jungsung = "ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣㅐㅒㅔㅖㅘㅙㅚㅝㅞㅟㅢ   ".split("");
    // const jongsung = "ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㄲㄸㅃㅆㅉ ".split("");

    // const isSelected = (type, ch) => {
    //   const chars = props.cate.forms[type]; //  'ㄱㄴㄷ...'
    //   return chars.includes(ch);
    // };
    const title = () => {
      const { level } = props.cate;
      return level >= 0 ? level + "단계" : "종합";
    };
    const startSentenceQuiz = (type) => {
      console.log("[MODE]", quizMode.value ? "QUIZ" : "LEARNING", type);
      api.section.sentences(props.cate.seq, "S").then((res) => {
        router.push(`/quiz/${props.cate.seq}`);
        console.log(res);
      });
    };
    const changeMode = (checked) => {
      console.log("[CHECKED]", checked);
    };
    return {
      title,
      quizMode,
      startSentenceQuiz,
      changeMode,
      // chosung,
      // jungsung,
      // jongsung,
      // isSelected,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
$padding: 16px;
.section-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
  .body {
    flex: 1 1 auto;
  }
  .jumbo {
    .title {
      display: flex;
      h3 {
        flex: 1 1 auto;
      }
    }
  }
  @include mobile {
    h3 {
      font-size: 1.5rem;
    }
  }
  @include tablet {
    h3 {
      font-size: 3rem;
    }
  }
  @include desktop {
    h3 {
      font-size: 4rem;
    }
  }
  &.pink {
    .jumbo {
      background-color: var(--aac-color-pink-400);
      color: var(--aac-color-pink-900);
      padding: 24px $padding;
    }
  }
  &.green {
    .jumbo {
      background-color: var(--aac-color-green-400);
      color: var(--aac-color-green-900);
      padding: 24px $padding;
    }
  }
  .body {
    .ko-char-view {
      display: flex;
      align-items: flex-start;
      padding: $padding;
      .chars {
        flex: 1;
        display: flex;
        align-items: flex-start;
        flex-wrap: wrap;
        justify-content: flex-start;
        .char-body {
          display: flex;
          align-items: flex-start;
          flex-wrap: wrap;
          justify-content: center;
        }
      }
    }
  }
  .footer {
    .choose {
      display: flex;
      justify-content: space-evenly;
      padding: $padding;
      column-gap: 1rem;
      h4 {
        flex: 1 1 auto;
      }
    }
  }
}
</style>

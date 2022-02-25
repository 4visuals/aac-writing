<template>
  <div class="section-detail" :class="theme">
    <div class="jumbo">
      <h3>{{ title() }}</h3>
    </div>
    <div class="body">
      <div class="ko-char-view">
        <p>{{ cate.description }}</p>
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
      <AacButton text="어휘학습" theme="pink" />
      <AacButton text="문장학습" theme="blue" />
    </div>
  </div>
</template>

<script>
// import { Char } from "@/components";
import { AacButton } from "@/components/form";
export default {
  props: ["cate", "theme"],
  components: {
    AacButton,
    // Char,
  },
  setup(props) {
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
    return {
      title,
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
  h3 {
    padding-bottom: 12px;
  }
  @include mobile {
    h3 {
      font-size: 1.5rem;
    }
    p {
      font-size: 1rem;
    }
  }
  @include tablet {
    h3 {
      font-size: 3rem;
    }
    p {
      font-size: 2rem;
    }
  }
  @include desktop {
    h3 {
      font-size: 4rem;
    }
    p {
      font-size: 2.5rem;
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
    display: flex;
    justify-content: space-evenly;
    padding: $padding;
  }
}
</style>

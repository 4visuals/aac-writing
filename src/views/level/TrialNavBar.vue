<template>
  <div class="header" :class="[theme]">
    <div class="title">
      <h3 class="text-ellipsis">체험하기</h3>
      <SpanText
        v-if="!section.isChallengeSection() && !resourceType"
        class="overview"
        @click="$emit('overview')"
        ><AppIcon icon="info" fsize="24px" /><span class="label"
          >학습 안내</span
        ></SpanText
      >
      <button class="nude exit" @click="$emit('back', 'trial')">
        체험종료
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { SpanText } from "../../components/text";
export default {
  components: {
    SpanText,
  },
  emits: ["overview", "back"],
  props: {
    section: {
      type: Object,
    },
    resourceType: {
      type: String,
      default: null,
    },
    theme: {
      type: String,
      default: "blue",
    },
  },
  setup(props, { emit }) {
    const wordMode = ref(props.section.isChallengeSection() ? false : true);
    const disableSwitch = ref(
      props.section.isChallengeSection() || !!props.quizMode
    );
    if (props.resourceType) {
      wordMode.value = props.resourceType === "W";
      disableSwitch.value = true;
    }
    const title = () => {
      const { section } = props;
      const { level } = section;
      return level >= 0 ? level + "단계" : "도전";
    };
    watch(wordMode, (isWord) => {
      emit("quizMode", isWord);
    });
    return { disableSwitch, wordMode, title };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
$padding: 16px;
.header {
  padding: 8px $padding;
  background-color: #4b7bec;
  color: white;
  &.word,
  &.sentence,
  &.trial {
    background-color: #ff114a;
    color: white;
  }
  .title {
    display: flex;
    column-gap: 16px;
    align-items: center;
    h3 {
      flex: 1 1 auto;
      display: inline-flex;
      align-items: center;
      font-size: 20px;
      .main {
        padding-left: 16px;
        font-weight: 600;
        white-space: nowrap;
      }
      .sub {
        margin-left: 16px;
        font-size: 0.7em;
        font-weight: 400;
      }
    }
    .overview {
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      column-gap: 4px;
      .label {
        white-space: nowrap;
      }
      @include mobile {
        .label {
          display: none;
        }
      }
    }
    .switch {
      flex: 0 0 auto;
    }
    .exit {
      background-color: #72001b;
      color: white;
      border-radius: 8px;
      font-size: 1.15rem;
    }
  }
}
@include mobile {
  .header {
    padding: 8px;
    .title {
      h3 {
        .main {
          padding-left: 8px;
          font-size: 16px;
        }
      }
      .icon {
        font-size: 24px;
      }
    }
  }
}
</style>

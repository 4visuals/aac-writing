<template>
  <div class="header">
    <div class="title">
      <h3 class="text-ellipsis">
        <ActionIcon
          class="icon"
          icon="expand_circle_down"
          @click="$emit('back', 'back')"
        />
        <span class="main">{{ title() }}</span
        ><span class="sub text-ellipsis">{{
          section.formatDescription()
        }}</span>
      </h3>
      <SpanText
        v-if="!section.isChallengeSection()"
        class="overview"
        @click="$emit('overview')"
        ><AppIcon icon="info" fsize="24px" /><span class="label"
          >학습 유형</span
        ></SpanText
      >
      <SwitchButton
        v-model:selected="wordMode"
        :disabled="quizOnly"
        onText="낱말"
        offText="문장"
        class="switch"
      />
      <ActionIcon class="icon" icon="cancel" @click="$emit('back', 'close')" />
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { ActionIcon, SwitchButton } from "../../components/form";
import { SpanText } from "../../components/text";
export default {
  components: {
    ActionIcon,
    SpanText,
    SwitchButton,
  },
  emits: ["overview", "back"],
  props: {
    section: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    const wordMode = ref(props.section.isChallengeSection() ? false : true);
    const quizOnly = ref(props.section.isChallengeSection());
    const title = () => {
      const { section } = props;
      const { level } = section;
      return level >= 0 ? level + "단계" : "도전";
    };
    watch(wordMode, (isWord) => {
      emit("quizMode", isWord);
    });
    return { quizOnly, wordMode, title };
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
    .icon {
      font-size: 32px;
      transform: rotate(90deg);
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

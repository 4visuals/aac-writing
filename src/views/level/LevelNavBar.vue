<template>
  <div class="header">
    <div class="title">
      <h3>
        <ActionIcon
          class="icon"
          icon="expand_circle_down"
          @click="$emit('back', 'back')"
        />
        <span class="main">{{ title() }}</span
        ><span class="sub">{{ section.description }}</span>
      </h3>
      <SpanText class="overview" @click="$emit('overview')">학습 안내</SpanText>
      <SwitchButton
        v-model:selected="wordMode"
        :disabled="quizOnly"
        onText="낱말"
        offText="문장"
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
    const quizOnly = false;
    const wordMode = ref(true);
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
$padding: 16px;
.header {
  padding: 13px $padding;
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
        line-height: 42px;
      }
      .sub {
        margin-left: 16px;
        font-size: 0.7em;
        font-weight: 400;
      }
    }
    .overview {
      cursor: pointer;
    }
    .icon {
      font-size: 32px;
      transform: rotate(90deg);
    }
  }
}
</style>

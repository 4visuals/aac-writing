<template>
  <div class="trials" :class="[theme.name, mode]">
    <h3>
      <AppButton :theme="theme.name" text="뒤로" @click="$emit('show-score')" />
    </h3>
    <div class="trial" v-for="trial in scoring.trials" :key="trial.index">
      <div class="e q">
        <SpanText class="mark">Q</SpanText
        ><SpanText class="txt"
          >{{ trial.orderInSection }}. {{ trial.text }}</SpanText
        >
      </div>
      <div class="e a">
        <SpanText class="txt">{{ trial.answer }}</SpanText>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { SpanText } from "../../../components/text";

export default {
  components: { SpanText },
  props: ["scoring", "resourceType"],
  setup(props) {
    const store = useStore();
    const theme = store.state.ui.theme;
    const mode = props.resourceType === "A" ? "S" : props.resourceType;
    return { theme, mode };
  },
};
</script>

<style lang="scss" scoped>
.trials {
  display: flex;
  flex-direction: column;
  padding: 16px;
  width: 100%;
  max-width: 599px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  &.W {
    row-gap: 8px;
    .trials {
      flex-direction: row;
      .mark {
        padding: 8px 0;
      }
      .txt {
        padding: 8px 16px;
      }
    }
  }
  &.S {
    row-gap: 4px;
    .trial {
      flex-direction: column;
      .mark {
        padding: 4px 0;
      }
      .txt {
        padding: 4px 16px;
      }
    }
  }
  .trial {
    display: flex;
    .e {
      display: flex;
    }
    .q {
      flex: 0 0 50%;
    }
    .a {
      flex: 0 0 50%;
    }
    .mark {
      font-weight: 700;
      padding: 8px 0;
    }
    .txt {
      padding: 8px 16px;
    }
  }
  &.blue {
    .mark {
      color: #4b7bec;
    }
    .a {
      background-color: #f0f5f9;
      color: #4b7bec;
      border-radius: 8px;
    }
  }
  &.brown {
    .mark {
      color: #865900;
    }
    .a {
      background-color: #f1ebdb;
      color: #865900;
      border-radius: 8px;
    }
  }
}
</style>

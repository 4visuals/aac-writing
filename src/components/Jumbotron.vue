<template>
  <div class="jumbo" ref="bannerEl">
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <div class="jumbo-body">
            <h3>{{ title }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from "vue";

export default {
  props: {
    title: {
      type: String,
      default: "no title",
    },
  },
  setup() {
    const bannerEl = ref(null);
    const bgx = ["10%", "25%", "50%", "75%"];
    let pos = 1;
    let timer = 0;
    const installBgSlider = () => {
      const el = bannerEl.value;

      timer = setInterval(() => {
        el.style.backgroundPositionX = bgx[pos];
        pos = (pos + 1) % bgx.length;
      }, 6000);
    };
    onMounted(() => {
      installBgSlider();
    });
    onUnmounted(() => {
      clearInterval(timer);
    });
    return { bannerEl };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.jumbo {
  display: flex;
  align-items: flex-end;
  background-image: linear-gradient(
    45deg,
    #f7fee2,
    #fff5de,
    #c6f9ff,
    #d2e2ff,
    #a5a8fb,
    #a3f2ff,
    #fdffeb,
    #b0ddcf
  );
  background-size: 800% 100%;
  background-position: 0% 0%;
  background-repeat: no-repeat;
  transition: background-position 2s ease;
  .jumbo-body {
    text-align: center;
    margin-bottom: 6rem;
    h3 {
      font-family: "NanumSquareRound", "Noto Sans KR", sans-serif;
    }
  }
}
@include mobile {
  .jumbo {
    height: 12rem;
    .jumbo-body {
      margin-bottom: 3rem;
    }
    h3 {
      font-size: 2rem;
      font-weight: 600;
    }
  }
}
@include tablet {
  .jumbo {
    height: 20rem;

    h3 {
      font-size: 3rem;
      font-weight: 900;
    }
  }
}
@include desktop {
  .jumbo {
    height: 20rem;
    h3 {
      font-size: 3rem;
      font-weight: 900;
    }
  }
}
</style>

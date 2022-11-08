<template>
  <section class="banner" ref="bannerEl">
    <div class="container">
      <div class="row">
        <div class="item col-xs-12 col-sm-6">
          <div class="inner">
            <h1>
              <span class="green">그</span><span class="blue">림</span
              ><span>한</span><span>글</span>&nbsp;<span>받아쓰기</span>
            </h1>

            <transition name="fade" mode="out-in">
              <div :key="idx" class="desc">
                <span>{{ titles[idx].text }}</span>
              </div>
            </transition>
          </div>
          <div class="login">
            <button class="nude" @click="gotoMain">받아쓰기 학습하기</button>
          </div>
        </div>
        <div class="item col-xs-12 col-sm-6">
          <div class="bg">
            <div class="wrapper">
              <transition name="fade" mode="out-in">
                <img :key="idx" :src="`/img/${titles[idx].bg}`" />
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { computed } from "@vue/reactivity";
export default {
  setup() {
    const store = useStore();
    const bannerEl = ref(null);
    const titles = [
      {
        text: "보고 듣고 받아쓰는 한글 학습",
        bg: "/pic000.png",
      },
      {
        text: "단계별, 반복 학습으로 한글을 배워요",
        bg: "/pic001.png",
      },
      {
        text: "나날이 발전하는 모습을 확인하세요",
        bg: "/pic002.png",
      },
      {
        text: "학습 이력을 조회할 수 있어요",
        bg: "/pic003.png",
      },
    ];
    const idx = ref(0);

    const logined = computed(() => store.getters["user/currentUser"]);
    let timer;
    const installBgSlider = () => {
      const el = bannerEl.value;
      const bgx = ["10%", "25%", "50%", "75%"];
      let pos = 1;
      timer = setInterval(() => {
        el.style.backgroundPositionX = bgx[pos];
        pos = (pos + 1) % bgx.length;
        const i = idx.value + 1;
        idx.value = i % titles.length;
      }, 6000);
    };
    const gotoMain = () => {
      location.href = "/";
    };
    onMounted(() => {
      installBgSlider();
    });
    onUnmounted(() => {
      clearInterval(timer);
    });
    return { bannerEl, titles, idx, logined, gotoMain };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
$fontcolor: #2a2a2a;
$navheight: 3.5rem;
$gradient: linear-gradient(
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
.banner {
  position: relative;
  padding-top: $navheight;
  height: 40rem;
  background-image: $gradient;
  background-size: 800% 100%;
  background-position: 0% 0%;
  background-repeat: no-repeat;
  transition: background-position 2s ease;
  display: flex;
  align-items: center;
  .container {
    flex: 1 1 auto;
    padding: 0;
    background-color: transparent;
    max-width: 960px;
    .row {
      align-items: center;
      margin: 0;
      .item {
        position: relative;
      }
    }
  }
  span {
    font-weight: 600;
    &.green {
      color: #2ca400;
    }
    &.blue {
      color: rgb(15, 68, 192);
    }
    &.pink {
      color: rgb(203, 3, 243);
    }
  }
  .bg {
    display: flex;
    align-items: center;
    margin-right: 2rem;
    user-select: none;
    .wrapper {
      transition: transform 0.5s cubic-bezier(0, 0, 0.24, 1);
      video {
        width: 100%;
        height: 100%;
        object-position: right;
      }
      img {
        width: 100%;
        height: auto;
        box-shadow: 0 0 16px #0000004d;
        border-radius: 16px;
      }
    }
  }
  .inner {
    margin: 0 3rem;
    h1 {
      font-weight: 600;
      font-size: 48px;
      display: flex;
      align-items: center;
    }
    .desc {
      margin: 24px 0;
      font-size: 24px;
      display: flex;
      flex-wrap: wrap;
      column-gap: 8px;
      position: relative;
      // &::after {
      //   content: "";
      //   background-color: $fontcolor;
      //   position: absolute;
      //   top: -12px;
      //   display: block;
      //   height: 2px;

      //   width: 100%;
      // }
    }
  }
  .login {
    position: absolute;
    top: 100%;
    left: 3rem;
    margin-top: 24px;
    box-shadow: 0 0 24px #0000004d, 1px 1px 8px #00000020;
    border-radius: 20px;
    background-color: #1a73e8;
    color: white;
    button.nude {
      color: inherit;
      padding: 6px 14px;
    }
  }
}
@media screen and (max-width: 767px) {
  .banner {
    .container {
      .row {
        .item {
          .bg {
            // display: none;
          }
        }
      }
    }
  }
}
@include mobile {
  .banner {
    height: 100vh;
    scroll-snap-align: center;
    .bg {
      margin: 0 3rem;
      display: none;
    }
  }
}
// @include tablet {
//   section {
//     .bg {
//       width: 350px;
//     }
//     .inner {
//       max-width: 40rem;
//     }
//   }
// }
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

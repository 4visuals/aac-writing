<template>
  <div class="word">
    <div class="video">
      <div class="device">
        <video muted autoplay loop playsinline>
          <source :src="url" type="video/mp4" />
        </video>
      </div>
    </div>
    <div class="desc">
      <div class="inner">
        <p v-for="(row, idx) in lines" :key="idx">{{ row || "" }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["url", "desc"],
  setup(props) {
    const lines = (props.desc || "")
      .split("\n")
      .filter((row) => row.trim().length > 0);
    return {
      lines,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.word {
  font-family: "NanumSquareRound", "Noto Sans KR", sans-serif;
  font-size: 24px;
  font-weight: 600;
  max-width: 680px;
  margin: 0 auto;
  .video {
    display: flex;
    justify-content: center;
    position: relative;
    z-index: 5;
    background-color: #444;
    border-radius: 20px;
    border: 20px solid #444;
    .device {
      video {
        display: block;
        width: 100%;
        object-fit: contain;
        max-width: 640px;
        border-radius: 8px;
        // outline: 20px solid #444;
      }
    }
  }
  .desc {
    color: white;
    display: flex;
    justify-content: center;
    position: relative;
    z-index: 1;
    background-color: #444;
    border-radius: 20px;
    transform: translateY(-40px);
    padding: 40px 20px 20px;
    .inner {
      max-width: calc(640px + 20px * 2);

      flex: 1 1 auto;
    }
  }
}
@include mobile {
  .word {
    font-size: 14px;
    font-weight: 400;
    .video {
      border-width: 12px;
      border-radius: 12px;
      .device {
        video {
          border-radius: 6px;
        }
      }
    }
    .desc {
      // padding: 12px;
      border-radius: 12px;
      transform: translateY(-40px);
      padding: 40px 12px 12px;
    }
  }
}
</style>

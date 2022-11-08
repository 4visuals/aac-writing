<template>
  <div class="word">
    <div class="video">
      <div class="device">
        <video muted autoplay loop playsinline>
          <source
            src="https://res.cloudinary.com/yeori-cloud/video/upload/g8379efg98ct/video001.mp4"
            type="video/mp4"
          />
        </video>
      </div>
    </div>
    <div class="desc">
      <p>문장을 듣고 제공되는 장면 사진을 보며 어절을 입력합니다.</p>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.word {
  font-family: "NanumSquareRound", "Noto Sans KR", sans-serif;
  font-size: 24px;
  font-weight: 600;
  .video {
    display: flex;
    justify-content: center;
    padding: 24px;
    video {
      width: 100%;
      object-fit: contain;
      max-width: 640px;
      border-radius: 16px;
      box-shadow: 0px 0px 8px #0000004d;
    }
  }
  .desc {
    padding: 0 24px 16px;
  }
}
</style>

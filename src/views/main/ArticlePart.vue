<template>
  <article
    :class="`${width} ${theme}`"
    @mouseover="subOn = true"
    @mouseleave="subOn = false"
  >
    <div class="box">
      <h5 v-if="article.caption">{{ article.caption }}</h5>
      <h3 data-aos="flip-up" data-aos-delay="200" data-aos-duration="200">
        {{ article.title }}
      </h3>
      <ul
        v-if="article.desc"
        data-aos="flip-up"
        data-aos-delay="400"
        data-aos-duration="200"
      >
        <li v-for="(para, idx) in article.desc" :key="idx">{{ para }}</li>
      </ul>
      <h4 data-aos="flip-up" data-aos-delay="600" data-aos-duration="200">
        {{ article.subtitle }}
      </h4>
      <div v-if="article.video" class="video">
        <video playsinline autoplay loop muted :src="article.video.url"></video>
      </div>
      <div
        v-if="article.media.length > 0"
        class="media"
        :class="{ col1, col2, col3 }"
      >
        <div
          v-for="(md, idx) in article.media"
          :key="idx"
          class="thumbnail"
          :class="[md.type]"
          :data-aos="idx === 0 ? 'fade-right' : 'fade-left'"
          :data-aos-delay="500 * idx"
        >
          <div v-if="md.type === 'thumbnail'" class="img">
            <img :src="`/img/intro/${md.imageUrl}`" />
          </div>
          <div class="desc">
            <p
              :class="{ center: md.type === 'thumbnail' }"
              v-for="(para, idx) in md.desc.split('\n')"
              :key="idx"
            >
              {{ para }}
            </p>
          </div>
          <div v-if="md.type === 'review'" class="reviewer">
            <h5>{{ md.userId }}</h5>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { ref } from "vue";

export default {
  props: ["width", "theme", "article", "col1", "col2", "col3"],
  setup() {
    const subOn = ref(false);
    return { subOn };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
$width: 700px;
article {
  display: flex;
  align-items: center;
  position: relative;
  // overflow: hidden;
  max-width: 1152px;
  padding: 0 16px;
  width: 100%;
  height: 100%;
  margin: auto;
  @media screen and (max-width: $width) {
    height: auto;
  }

  .box {
    flex: 1 1 auto;
    position: relative;
    z-index: 5;
    // color: #ffffffaa;
    // text-shadow: 2px 2px 4px #0000004d;
    h3 {
      font-size: 5vmin;
      font-weight: 900;
      text-align: center;
    }
    h4 {
      margin: 4rem 0;
      font-size: 3.5vmin;
      font-weight: 900;
      text-align: center;
    }
    h5 {
      font-size: 2vmin;
      margin-bottom: 2vmin;
      text-align: center;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 60px 0;
      font-size: 2vmin;
      text-align: center;
      li {
        margin-bottom: 8px;
      }
    }
    .subtitle {
      position: absolute;
      top: 100%;
      left: 0;
      font-size: 0.7em;
      margin-top: 12px;
    }
    .video {
      justify-content: center;
      display: flex;
      width: 100%;
      margin: auto;
      // height: 500px;
      video {
        width: 100%;
        flex: 1 1 auto;
      }
    }
    .media {
      width: 100%;
      justify-content: space-between;
      display: grid;

      grid-template-rows: 1fr;
      column-gap: 24px;
      @media screen and (max-width: $width) {
        display: flex;
        flex-direction: column;
        .thumbnail {
          margin-bottom: 16px;
        }
      }
      &.col1 {
        grid-template-columns: 1fr;
      }
      &.col2 {
        grid-template-columns: 1fr 1fr;
        .thumbnail {
          .desc {
            text-align: left;
            margin: 16px;
          }
        }
      }
      &.col3 {
        grid-template-columns: 1fr 1fr 1fr;
      }

      .thumbnail {
        width: 100%;
        background-color: white;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 2px 2px 4px #0000004d, 0 0 2px #0000004d;
        position: relative;
        &.review {
          .desc {
            font-weight: 400;
            p {
              line-height: 1.8;
              margin-bottom: 1rem;
            }
          }
          .reviewer {
            text-align: center;
            margin: 16px;
            position: sticky;
            top: 100%;
            h5 {
              font-size: 1.5rem;
              font-style: italic;
              text-align: right;
            }
          }
        }
        .img {
          & > img {
            width: 100%;
            height: auto;
          }
        }
        .desc {
          margin: 16px 0;
          text-align: center;
          font-size: 1.25rem;
          font-weight: 600;
          p.center {
            text-align: center;
          }
        }
      }
    }
  }
  .view {
    position: absolute;
    right: 2rem;
    bottom: 2rem;
  }
}

@include mobile {
  article {
    .box {
      h3 {
        font-size: 22px;
      }
      h4 {
        font-size: 16px;
      }
      ul {
        font-size: 1rem;
        margin: 16px;
      }
      .media {
        display: flex;
        flex-direction: column;
        padding: 0 8px;
        .thumbnail {
          flex: 1 1 auto;
          border-radius: 8px;
          overflow: hidden;
          margin: 0 0 24px;
          .img {
            margin: 0;
            border-radius: 8px;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            background-size: 110%;
          }
          .desc {
            margin-top: 6px 0;
            font-size: 1rem;
          }
        }
      }
    }
  }
}
</style>

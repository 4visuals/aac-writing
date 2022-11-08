<template>
  <div class="home" @scroll="detectScroll">
    <TeacherNav :fixed="fixedMenu" @logout="doLogout" />
    <BannerView />
    <section class="info pc">
      <ArticlePart
        v-for="(each, idx) in articles"
        :key="idx"
        :article="each.article"
        :width="each.ui.width"
        :theme="each.ui.theme"
        @detail="popupDetail"
      />
    </section>
    <section class="info mobile" v-for="(each, idx) in articles" :key="idx">
      <ArticlePart
        :article="each.article"
        width="v100"
        :theme="each.ui.theme"
        @detail="popupDetail"
      />
    </section>
    <section class="company">
      <div class="policy">
        <router-link
          active-class="pol"
          exact-active-class="active"
          to="/policy/tou"
          >이용 약관</router-link
        >
        <router-link
          active-class="pol"
          exact-active-class="active"
          to="/policy/privacy"
          >개인정보처리방침</router-link
        >
      </div>
      <div class="cmp-detail">
        <p>
          (주)성주코퍼레이션 | 정인균 | 사업자번호 402-88-01673 | TEL:
          070-7808-8807
        </p>
        <p>contact@kdict.kr</p>
        <p>서울특별시 성동구 왕십리로 24나길 20, 2층 243호 (창성빌딩)</p>
        <p>© 2022 그림한글. All rights reserved.</p>
      </div>
    </section>
    <teleport to="body" v-if="modal.visible">
      <Modal @hidden="modal.visible = false" :fill="true" :rect="true">
        <ModalHeader :shadow="true"
          ><ActionIcon
            icon="arrow_back"
            @click="modal.visible = false"
          ></ActionIcon
          ><SpanText>학생 등록</SpanText></ModalHeader
        >
        <LicenseConfigView
          :license="modal.lcs"
          :licenses="licenses"
          :students="students"
        />
      </Modal>
    </teleport>
  </div>
</template>

<script>
import { host } from "@/service/util";
import { useStore } from "vuex";
import { watch, ref } from "vue";
import { useRouter } from "vue-router";
import { computed } from "@vue/reactivity";
import { LicenseConfigView } from "@/components/admin";
import { SpanText } from "@/components/text";
import { ActionIcon } from "../components/form";
import TeacherNav from "./nav/TeacherNav.vue";
import BannerView from "./main/Banner.vue";
import ArticlePart from "./main/ArticlePart.vue";
import modalHandler from "../components/modal";
import IntroWord from "./main/IntroWord.vue";

export default {
  name: "Home",
  components: {
    LicenseConfigView,
    SpanText,
    ActionIcon,
    TeacherNav,
    BannerView,
    ArticlePart,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const students = computed(() => store.getters["user/students"]);
    const licenses = computed(() => store.state.user.membership.licenses);
    const member = computed(() => store.getters["user/isMember"]);
    const modal = ref({ visible: false, lcs: null });
    const fixedMenu = ref(false);
    const intro = {
      word: {
        type: "video",
        url: "https://res.cloudinary.com/yeori-cloud/video/upload/g8379efg98ct/video000.mp4",
        mime: "video/mp4",
        desc: "낱말을 음성으로 듣고 입력합니다.\n그림을 보며 낱말의 의미를 이해합니다.",
        component: IntroWord,
      },
      sen: {
        type: "video",
        url: "https://res.cloudinary.com/yeori-cloud/video/upload/g8379efg98ct/video001.mp4",
        mime: "video/mp4",
        desc: "문장과 함께 제공되는 장면 사진들.\n어절 단위로 입력하며 띄어쓰기를 익힙니다.",
        component: IntroWord,
      },
      pic: {
        type: "video",
        url: "https://res.cloudinary.com/yeori-cloud/video/upload/g8379efg98ct/video005.mp4",
        mime: "video/mp4",
        desc: "그림을 보며 낱말을 익혀요.\n장면을 보며 문장의 의미를 이해해요.",
        component: IntroWord,
      },
      book: {
        type: "video",
        url: "https://res.cloudinary.com/yeori-cloud/video/upload/g8379efg98ct/video002.mp4",
        mime: "video/mp4",
        desc: "단계별 학습 후 교과서 문장을 익힙니다.\n저학년 수준의 문장들을 연습할 수 있어요.",
        component: IntroWord,
      },
      stat: {
        type: "video",
        url: "https://res.cloudinary.com/yeori-cloud/video/upload/g8379efg98ct/video003.mp4",
        mime: "video/mp4",
        desc: "학습 결과를 참고하세요.\n입력한 오답을 참고해서 교육에 활용할 수 있어요.",
        component: IntroWord,
      },
      study: {
        type: "video",
        url: "https://res.cloudinary.com/yeori-cloud/video/upload/g8379efg98ct/video004.mp4",
        mime: "video/mp4",
        desc: "문제를 듣고 글자를 보고 쓰기\n익숙해진 후 보지 않고 학습\n마지막 퀴즈로 완성",
        component: IntroWord,
      },
    };
    const articles = [
      {
        article: { id: "word", title: "낱말", detail: "780개의 단어들" },
        ui: { width: "w40", theme: "bluesky" },
      },
      {
        article: {
          id: "sen",
          title: "문장",
          detail: "장면 사진을 보고 듣고 쓰기",
        },
        ui: { width: "w60", theme: "bora" },
      },
      {
        article: {
          id: "pic",
          title: "상징과 장면",
          detail: "낱말과 문장마다 제시되는 그림들",
        },
        ui: { width: "w60", theme: "pink" },
      },
      {
        article: { id: "book", title: "교과서", detail: "교과서로 공부해요" },
        ui: { width: "w40", theme: "orange" },
      },
      {
        article: {
          id: "stat",
          title: "학습 통계",
          detail: "공부한 결과를 확인해요.",
        },
        ui: { width: "w50", theme: "bluesky" },
      },
      {
        article: {
          id: "study",
          title: "연습, 퀴즈",
          detail: "보고쓰기, 학습을 거쳐 퀴즈를 풀어봐요.",
        },
        ui: { width: "w50", theme: "gold" },
      },
    ];
    const moveTo = (url, license) => {
      // console.log("move to ", url);
      store.commit("exam/setActiveLicense", license);
      router.replace(url);
      store.commit("ui/setNavSize", { expanded: false, topPadding: 120 });
    };
    const showLicenseConfig = (lcs) => {
      modal.value.visible = true;
      modal.value.lcs = lcs;
      console.log(licenses);
    };
    const doLogout = () => {
      const { email } = member.value;
      store.commit("user/logoutUser", email);
      window.google.accounts.id.revoke(email, (res) => {
        console.log("[DONE]", res);
      });
    };

    const detectScroll = (e) => {
      const scroll = e.target.scrollTop;
      fixedMenu.value = scroll > 180;
    };

    const popupDetail = (article) => {
      // console.log(article);
      const elem = intro[article.id];
      const { url, desc } = elem;
      modalHandler.showModal(elem.component, {
        width: "md",
        fill: false,
        noBgc: true,
        noShadow: true,
        props: { url, desc },
      });
    };
    const handleRes = (res) => {
      console.log(res);
    };

    watch(
      () => member,
      (isMember) => {
        if (isMember) {
          console.log("move to level");
        }
      },
      { immediate: true }
    );
    store.commit("ui/setNavSize", { expanded: false, topPadding: 0 });
    store.commit("ui/setBackgroundVisible", false);
    store.commit("ui/hideMenu");

    return {
      modal,
      member,
      students,
      licenses,
      fixedMenu,
      articles,
      moveTo,
      showLicenseConfig,
      host,
      doLogout,
      detectScroll,
      popupDetail,
      handleRes,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/resizer";
$bgcolor: #fffdf4;
$fontcolor: #2a2a2a;
$navheight: 3.5rem;

$trasition: all 1s ease;
.home {
  color: $fontcolor;
  background-color: $bgcolor;
  position: relative;
  font-family: "NanumSquareRound", "Noto Sans KR", sans-serif;
  height: 100%;
  overflow-y: auto;
  padding: 0;
  position: relative;
  // &::-webkit-scrollbar-thumb {
  //   background: rgba(190, 90, 90);
  // }

  &::-webkit-scrollbar-track {
    background: rgba(100, 255, 255, 0);
  }

  a {
    color: inherit;
    text-decoration: none;
    line-height: 1;
    &.btn {
      padding: 4px;
    }
  }
  section {
    &.info {
      &.pc {
        display: flex;
        flex-wrap: wrap;
      }
      &.mobile {
        scroll-snap-type: y mandatory;
        display: none;
      }
    }
    &.company {
      background-color: #242424;
      color: #ccc;
      padding: 16px;
      scroll-snap-align: end;
      .policy {
        display: inline-flex;
        flex-direction: column;
        margin-bottom: 20px;
        row-gap: 8px;
        position: relative;
        &:after {
          content: "";
          position: absolute;
          height: 1px;
          bottom: -10px;
          left: 0;
          width: 100%;
          background-color: #ccc;
        }
        a {
          color: white;
          &:hover {
            color: rgb(125, 168, 255);
          }
        }
      }
      .cmp-detail {
        p {
          font-size: 0.8em;
          margin: 0;
          line-height: 1.5;
        }
      }
    }
  }
}
@include mobile {
  .home {
    scroll-snap-type: y mandatory;
    font-size: 16px;
    .logo {
      height: 75px;
      &.sub {
        height: 60px;
      }
    }
    section.info {
      &.pc {
        display: none;
      }
      &.mobile {
        display: flex;
        flex-direction: column;
        scroll-snap-align: center;
        height: 50vh;
      }
    }
  }
}
@include tablet {
  .home {
    font-size: 16px;
    .logo {
      height: 120px;
      &.sub {
        height: 100px;
      }
    }
    section.info {
      flex-direction: column;
      article {
        &.w40,
        &.w50,
        &.w60 {
          width: 100%;
        }
      }
    }
  }
}
@include desktop {
  .home {
    font-size: 16px;
    .logo {
      height: 120px;
      &.sub {
        height: 100px;
      }
    }
  }
}
.home {
  .logout {
    width: 48px;
    height: 48px;
    background-color: crimson;
    color: white;
    position: fixed;
    top: 16px;
    right: 16px;
    font-size: 1.1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: none;
    border-radius: 24px;
  }

  .logo {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin-bottom: 32px;
    &.main {
      background-image: url("/img/white_back_02.png");
    }
    &.sub {
      background-image: url("/img/badassgi.png");
    }
  }
  .login {
    display: flex;
    justify-content: center;
    margin: 4rem auto;
    max-width: 300px;
  }
  .title {
    font-family: "Roboto", sans-serif;
    &.main {
      font-size: 2em;
    }
    &.sub {
      font-size: 1em;
      color: #146b27;
    }
  }
  .menu {
    max-width: 480px;
    margin: 0 auto;
    width: 100%;
    scroll-snap-align: center;
    .students {
      margin-top: 24px;
      .stud-reg {
        margin: 24px 0;
        display: flex;
        align-items: center;
        flex-direction: column;
      }
    }
  }
}
</style>

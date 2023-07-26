<template>
  <div class="support" @scroll="detectScroll">
    <!-- <TeacherNav :fixed="fixedMenu" @logout="doLogout" /> -->
    <UserGnb />
    <section
      class="info"
      :style="`background-image: url(/img/bg/pg-main.svg); background-color: ${articles.main.style.bgc}`"
    >
      <ArticlePart :article="articles.main" :col1="true" />
    </section>
    <section
      class="info"
      :style="`background-image: url(/img/bg/pg0.svg); background-color: ${articles.pg0.style.bgc}`"
    >
      <ArticlePart :article="articles.pg0" :col3="true" />
    </section>
    <section
      class="info"
      :style="`background-image: url(/img/bg/pg1.svg); background-color: ${articles.pg1.style.bgc}`"
    >
      <ArticlePart :article="articles.pg1" :col3="true" />
    </section>
    <section
      class="info"
      :style="`background-image: url(/img/bg/pg2.svg); background-color: ${articles.pg2.style.bgc}`"
    >
      <ArticlePart :article="articles.pg2" :col3="true" />
    </section>
    <section
      class="info"
      :style="`background-image: url(/img/bg/pg3.svg); background-color: ${articles.pg3.style.bgc}`"
    >
      <ArticlePart :article="articles.pg3" :col3="true" />
    </section>
    <section
      class="info"
      :style="`background-image: url(/img/bg/pg4.svg); background-color: ${articles.pg4.style.bgc}`"
    >
      <ArticlePart :article="articles.pg4" :col3="true" />
    </section>
    <section
      class="info"
      :style="`background-image: url(/img/bg/pg5.svg); background-color: ${articles.pg5.style.bgc}`"
    >
      <ArticlePart :article="articles.pg5" :col3="true" />
    </section>
    <section
      class="info"
      :style="`background-image: url(/img/bg/pg6.svg); background-color: ${articles.pg6.style.bgc}`"
    >
      <ArticlePart :article="articles.pg6" :col2="true" />
    </section>
    <CompanyInfoDark />
  </div>
</template>

<script>
import { host } from "@/service/util";
import { useStore } from "vuex";
import { watch, ref } from "vue";
import { useRouter } from "vue-router";
import { computed } from "@vue/reactivity";
import UserGnb from "./nav/UserGnb.vue";
import ArticlePart from "./main/ArticlePart.vue";
import CompanyInfoDark from "@/components/company/CompanyInfoDark.vue";

export default {
  name: "Home",
  components: {
    UserGnb,
    ArticlePart,
    CompanyInfoDark,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const students = computed(() => store.getters["user/students"]);
    const licenses = computed(() => store.state.user.membership.licenses);
    const member = computed(() => store.getters["user/isMember"]);
    const modal = ref({ visible: false, lcs: null });
    const fixedMenu = ref(false);
    const articles = {
      main: {
        style: {
          bgc: "#D2ECFD",
        },
        caption: "그림으로 시작하고 교과서로 다지는 ",
        title: "그림한글 받아쓰기",
        desc: "",
        video: {
          mime: "video/mp4",
          url: "/img/intro/intro.mp4",
        },
        media: [],
      },
      pg0: {
        style: {
          bgc: "#F2FAFC",
        },
        title: "“재미있는 받아쓰기 공부는 없나요?”",
        desc: `1학년 첫시험. 받아쓰기는 아이에게도 엄마에게도 부담입니다.
손가락이 아프도록 한바닥씩 공책에 써가며 반복하는 공부 방식은 받아쓰기를 지겹고 재미없는 공부로 만드는 주범입니다.
그림한글 받아쓰기에서는 정확한 맞춤법으로 낱말을 입력하면 마술처럼 해당 그림이 나타납니다.
학생들은 맞는 그림이 나타날 때까지 스스로 오류를 수정하는 과정을 반복하며 재미있게 맞춤법을 배웁니다.`.split(
          "\n"
        ),
        subtitle: "재미있는 한글 맞춤법 공부, 그림한글 받아쓰기",
        media: [
          {
            type: "thumbnail",
            imageUrl: "1-1.png",
            desc: `글자를 입력하면 의문사가 그림으로 바뀌어요.
[단계별 ] 보고쓰기/ 연습하기`,
          },
          {
            type: "thumbnail",
            imageUrl: "1-2.png",
            desc: `맞고 틀린 것을 바로 확인할 수 있어요.
[단계별/교과서 ] 보고쓰기/ 연습하기`,
          },
          {
            type: "thumbnail",
            imageUrl: "1-3.png",
            desc: `도움이 필요할 때는 힌트를 보고 해요.
[단계별/교과서 ] 연습하기`,
          },
        ],
      },
      pg1: {
        style: {
          bgc: "#D2ECFD",
        },
        title: "“한글 맞춤법, 무조건 외워야 하나요?”",
        desc: `1,2학년 받아쓰기는 교과서의 낱말과 문장을 통째로 외웁니다. 이렇게 2년 동안 교과서의 문장을 통째로 외우다 보면 저절로 한글 맞춤법을 익히게 되지요.
이렇게 미련한 방법 말고 다른 방법은 없을까요?
그림한글 받아쓰기는 한글 맞춤법을 난이도에 따라 분석하여 유형화하여 50단계로 체계화하였습니다.
유형별로 단계적으로 학습하면 한글 맞춤법의 규칙과 원리를 이해하여 재미있는 받아쓰기 공부를 할 수 있습니다.`.split(
          "\n"
        ),
        subtitle: "체계적인 50단계 맞춤법 공부, 그림한글 받아쓰기",
        media: [
          {
            type: "thumbnail",
            imageUrl: "2-1.png",
            desc: `50개의 단계로 구성된 단계별 받아쓰기`,
          },
          {
            type: "thumbnail",
            imageUrl: "2-2.png",
            desc: `단계별로 낱말과 문장으로 학습해요.`,
          },
          {
            type: "thumbnail",
            imageUrl: "2-3.png",
            desc: `어절별로 입력하며 저절로 띄어쓰기를 익혀요.`,
          },
        ],
      },
      pg2: {
        style: {
          bgc: "#F2FAFC",
        },
        title: "“받아쓰기로 문해력을 키울 수 있나요?”",
        desc: `문해력은 글을 읽고 내용을 이해하는 능력입니다.
한글을 해득했는데도 글을 읽은 후 낱말이나 문장의 뜻을 제대로 파악하지 못하는 문해력이 부족한 아이들이 점점 많아지고 있습니다.
학습의 기초가 되는 읽기 이해에 어려움이 있다보니 점차 모든 학습에 흥미를 잃고 수업시간도 재미없어집니다.
그림한글 받아쓰기는 1,000개의 낱말과 600개의 문장을 소리, 그림과 함께 제시하여 
그림을 통해 낱말과 문장의 의미를 직관적으로 알게 되고 문해력은 저절로 향상됩니다.`.split(
          "\n"
        ),
        subtitle: "초기 문해력 향상의 열쇠, 그림한글 받아쓰기",
        media: [
          {
            type: "thumbnail",
            imageUrl: "3-1.png",
            desc: `그림과 함께 낱말의 정확한 의미를 익혀요.`,
          },
          {
            type: "thumbnail",
            imageUrl: "3-2.png",
            desc: `그림과 함께 문장의 정확한 의미를 익혀요.`,
          },
          {
            type: "thumbnail",
            imageUrl: "3-3.png",
            desc: `보고 듣고 타이핑하고 쓰고, 
여러 감각으로 통합하여 배워요.`,
          },
        ],
      },
      pg3: {
        style: {
          bgc: "#D2ECFD",
        },
        title: "“받아쓰기를 혼자서 공부할 수 없을까요?”",
        desc: `엄마가 불러주고 채점하고 틀린 글자들을 연습하고 다시 시험보며 학교 받아쓰기를 준비합니다.
‘아까 틀린 글자는 맞았지만, 아까 맞은 글자는 이번에는 틀리고.’  이런 과정을 반복하며 아이들은 받아쓰기에 대한 자신감을 잃게 됩니다.
그림한글 받아쓰기에 수록된 낱말과 문장은 초등학교 교사들이 1,2학년 교과서에서 엄선한 핵심문장입니다.
추출한 낱말과 문장을 보고쓰기-연습하기-받아쓰기-듣고쓰기 4단계 난이도로 학습할 수 있습니다. 누가 불러주거나 채점해주지 않아도 스스로 틀린 것을 확인하고 오류를 수정하며 반복하면 완전학습에 도달할 수 있도록 구성되었습니다.`.split(
          "\n"
        ),
        subtitle: "자기주도 학습의 시작, 그림한글 받아쓰기",
        media: [
          {
            type: "thumbnail",
            imageUrl: "4-1.png",
            desc: `학생 수준에 맞는 학습유형을 선택할 수 있어요.`,
          },
          {
            type: "thumbnail",
            imageUrl: "4-2.png",
            desc: `틀린 문제만 다시, 오답만 모아 복습해요.`,
          },
          {
            type: "thumbnail",
            imageUrl: "4-3.png",
            desc: `태블릿으로 문제를 들으며 연습공책에 연필로 써요.`,
          },
        ],
      },
      pg4: {
        style: {
          bgc: "#F2FAFC",
        },
        title: "“받아쓰기는 꼭 연필로 써야만 할까요?”",
        desc: `자음과 모음을 키보드로 입력하며 글자를 배우면 자모음의 결합으로 글자가 만들어지는 한글의 구조와 원리를 더 쉽게 이해할 수 있습니다.
특히 쥐는 힘이 부족하여 연필을 제대로 잡지 못하거나 쓰기를 어려워하는 아이들의 경우 키보드로 입력하며 배우면 더 쉽게 한글을 익힐 수 있습니다.
또한 디지털 기기가 학습의 도구라는 인식을 어릴 때부터 갖게 되어 건전하고 미래지향적인 디지털 학습 습관의 기초가 됩니다.`.split(
          "\n"
        ),
        subtitle: "디지털 리터러시도 쑥쑥, 그림한글 받아쓰기",
        media: [
          {
            type: "thumbnail",
            imageUrl: "5-1.png",
            desc: `키보드로 입력하며 한글 구성의 원리를 깨달아요.`,
          },
          {
            type: "thumbnail",
            imageUrl: "5-2.png",
            desc: `스마트펜슬로 태블릿에 직접 글씨를 써요.`,
          },
          {
            type: "thumbnail",
            imageUrl: "5-3.jpg",
            desc: `블루투스 키보드로 입력해요.`,
          },
        ],
      },
      pg5: {
        style: {
          bgc: "#D2ECFD",
        },
        title: "아이의 성장을 지켜보며 함께 기뻐해 주세요!",
        desc: undefined,
        subtitle: undefined,
        media: [
          {
            type: "thumbnail",
            imageUrl: "6-1_1.png",
            desc: `100점으로 성공적인 학습 경험을 쌓아요. `,
          },
          {
            type: "thumbnail",
            imageUrl: "6-2_1.png",
            desc: `매일 공부한 것을 확인할 수 있어요.`,
          },
          {
            type: "thumbnail",
            imageUrl: "6-3_1.png",
            desc: `받아쓰기 성취도를 한 눈에 볼 수 있어요.`,
          },
        ],
      },
      pg6: {
        style: {
          bgc: "#F2FAFC",
        },
        title: "이용 후기",
        desc: undefined,
        subtitle: undefined,
        media: [
          {
            type: "review",
            desc: "학습수준별로 시작 단계를 설정할 수 있는 촘촘한 구성과 편안한 화면 구성, 적절한 소리 제공 등 세심하게 아이들을 생각해서 만들어 주신 프로그램입니다. 놀이처럼 생각해서 아이들이 틀리는 것마저 재미있어합니다~ 받아쓰기를 손으로 써서 반복학습하려면 아이들도 지겹고 힘들고, 쓰기 자체를 거부하는 친구도 있는데 받아쓰기 프로그램이 큰 도움이 되었습니다. 아이들이 좋아하는 학습도구인 태블릿을 이용하여 놀이처럼 스트레스를 받지 않고 어느 순간 훌쩍 성장해 있는 모습을 발견하게 되실거예요!",
            userId: "특수교사 민OO",
          },
          {
            type: "review",
            desc: `쓰는 것을 싫어하고 거부하던 학생들이 처음에 한말이 “이거 재밌어요!” 였습니다.  자연스럽게 학생들이 자기주도적으로 학습하는 모습을 볼 수 있었고, 받아쓰기를 하지 않는 친구도 엄청 관심을 보여서 서로에게 긍정적인인 효과가 있었습니다. 읽기는 하지만 쓰기가 어려웠던 친구들에게 더 효과가 좋았던 거 같습니다.
 학생들의 학습 결과가 바로 바로 피드백이 되어 학생들이 다시금 도전해 보거나  성취감을 느낄 수 있어서 좋았습니다.  가정과도 연계하여 학습할 수 있으며 자기주도학습과 바른 습관 형성에도 도움이 되었습니다.`,
            userId: "특수교사 한OO",
          },
        ],
      },
    };
    const moveTo = (url, license) => {
      // console.log("move to ", url);
      store.commit("exam/setActiveLicense", license);
      router.replace(url);
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
.support {
  color: $fontcolor;
  background-color: $bgcolor;
  position: relative;
  font-family: "NanumSquareRound", "Noto Sans KR", sans-serif;
  height: 100%;
  overflow-y: auto;
  padding: 0;
  position: relative;
  // scroll-snap-type: y mandatory;
  // scroll-behavior: smooth;
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
  section.info {
    // scroll-snap-align: center;
    height: 100vh;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    @media screen and (max-width: 700px) {
      height: auto;
      padding: 6rem 0;
      background-size: 50%;
      background-position: left top;
    }
  }
}
@include mobile {
  .support {
    // scroll-snap-type: y mandatory;
    font-size: 12px;
    .logo {
      height: 75px;
      &.sub {
        height: 60px;
      }
    }
    section.info {
      // height: auto;
      &.pc {
        display: none;
      }
      &.mobile {
        display: flex;
        flex-direction: column;
        // scroll-snap-align: center;
        height: 50vh;
      }
    }
  }
}
@include tablet {
  .support {
    font-size: 12px;
    .logo {
      height: 120px;
      &.sub {
        height: 100px;
      }
    }
    section.info {
      flex-direction: column;
    }
  }
}
@include desktop {
  .support {
    font-size: 12px;
    .logo {
      height: 120px;
      &.sub {
        height: 100px;
      }
    }
  }
}
.support {
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

<template>
  <div class="container">
    <div class="row group" v-for="row in rows" :key="row">
      <div class="col-12">
        <h3 class="title">여기 제목</h3>
      </div>
      <div
        class="col-12 col-sm-6 col-md-4 col-lg-3"
        v-for="(quiz, idx) in row.quiz"
        :key="quiz.seq"
      >
        <SectionButton
          :item="quiz"
          :idx="idx"
          @itemClicked="showDetail"
          theme="pink"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <SectionButton
          :item="row.test[0]"
          :idx="row.quiz.length"
          @itemClicked="showDetail"
          theme="green"
        />
      </div>
    </div>
    <teleport to="body" v-if="activeCate">
      <Modal ref="modal" @hidden="hideModal">
        <SectionView :cate="activeCate" />
      </Modal>
    </teleport>
  </div>
</template>

<script>
import SectionButton from "@/components/SectionButton.vue";
import { Modal } from "@/components";
import SectionView from "./SectionView.vue";
import { useStore } from "vuex";
import { computed, ref } from "vue";
import router from "@/router";
export default {
  props: ["cate"],
  components: {
    SectionButton,
    SectionView,
    Modal,
  },
  setup() {
    const store = useStore();
    // console.log(store.state.course.cates.level);
    const modal = ref(null);
    let activeCate = ref(null);
    const showDetail = (cate) => {
      activeCate.value = cate;
    };
    const rows = computed(() => store.state.course.cates.level);
    const moveTo = (quiz) => {
      console.log(quiz);
      router.push("/quiz/" + quiz.seq);
    };
    const hideModal = () => {
      console.log("one");
      activeCate.value = null;
    };
    return {
      modal,
      rows,
      moveTo,
      showDetail,
      activeCate,
      hideModal,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
@include mobile {
  .group {
    margin-bottom: 2rem;
  }
  .title {
    font-size: 1.25rem;
  }
}
@include tablet {
  .group {
    margin-bottom: 4rem;
  }
  .title {
    font-size: 4rem;
  }
}
@include desktop {
  .group {
    margin-bottom: 4rem;
  }
  .title {
    font-size: 4rem;
  }
}
</style>

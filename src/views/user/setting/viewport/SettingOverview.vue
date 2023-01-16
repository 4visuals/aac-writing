<template>
  <div>
    <WidthLayout> <h3>반갑습니다.</h3> </WidthLayout>
    <WidthLayout>
      <section @click="routeTo('account')">
        <h4>내 정보</h4>
        <p>이름, 비밀번호 등을 수정할 수 있습니다.</p>
      </section>
    </WidthLayout>
    <WidthLayout>
      <section @click="routeTo('license')">
        <h4>이용권</h4>
        <p>사용중인 이용권을 확인합니다.</p>
      </section>
    </WidthLayout>
    <WidthLayout>
      <section @click="routeTo('student')">
        <h4>학생 관리</h4>
        <p>학생 추가, 삭제합니다.</p>
      </section>
    </WidthLayout>
    <WidthLayout>
      <section @click="routeTo('student')">
        <h4>구매 내역</h4>
        <p>상품 구매 이력을 확인합니다.</p>
      </section>
    </WidthLayout>
  </div>
</template>

<script>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import WidthLayout from "../../../../components/layout/WidthLayout.vue";
export default {
  components: {
    WidthLayout,
  },
  setup() {
    const store = useStore();
    const menus = computed(() => store.state.setting.menus);
    const router = useRouter();
    const routeTo = (path) => {
      const menu = menus.value.find((m) => m.path === path);
      store.commit("setting/setActive", menu);
      router.replace(menu.getFullPath());
    };
    return { routeTo };
  },
};
</script>

<style lang="scss" scoped>
section {
  box-shadow: 0px 0px 4px #0000001d, 0 0 2px #0000002d;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  font-size: 1.15rem;
  transition: box-shadow 0.2s linear, transform 0.2s linear;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 0px 8px #2f8ed87a, 0 0 2px #2f8ed8c7;
    transform: scale(1.01);
  }
  h4 {
    margin-bottom: 8px;
  }
  .box {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
  }
}
</style>

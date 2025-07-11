<template>
  <div class="licenses">
    <h5>학생에게 연결할 이용권을 선택해주세요</h5>
    <!-- Text updated -->
    <div class="list">
      <div
        v-for="lic in filterValidLicense()"
        :key="lic.seq"
        @click="setActive(lic)"
        class="each"
        :class="{ active: activeLicense === lic }"
      >
        <span class="name">구매일 {{ toYMD(lic.createdAt) }}</span>
        <span class="name">종료일 {{ toYMD(lic.expiredAt) }}</span>
        <!-- Display license name, assuming 'name' property -->
        <button
          v-if="activeLicense === lic"
          @click.stop="$emit('bind-license', { license: lic, student })"
          class="nude blue"
        >
          연결
        </button>
      </div>

      <!-- Message shown if no licenses are available -->
      <div v-if="licenses.length === 0" class="no-items-message">
        <p>사용 가능한 이용권이 없습니다.</p>
      </div>

      <div class="management-link-section">
        <p>
          이용권 관리 페이지에서 이용권을 확인하거나 구매할 수 있습니다.
          <button
            class="nude blue round"
            @click.prevent="navigateToLicensePage()"
          >
            이동
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { time } from "@/service/util";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import modal from "@/components/modal"; // Assuming this is a shared modal utility like in StudentList.vue
import { ref, computed } from "vue";

export default {
  name: "LicenseMappingList", // Component name
  emits: ["bind-license"],
  props: ["student"],
  setup(props) {
    console.log(props);
    const store = useStore();
    const router = useRouter();

    const licenses = computed(() => store.state.user.membership.licenses);

    const activeLicense = ref(null);

    const setActive = (license) => {
      activeLicense.value = license;
    };

    const navigateToLicensePage = () => {
      if (modal && typeof modal.closeModal === "function") {
        modal.closeModal();
      }
      router.replace("/licenses/purchase-or-manage"); // Example URI
    };
    const filterValidLicense = () =>
      licenses.value.filter(
        (/** @type {import('../../../../entity/license').default} */ lcs) =>
          !lcs.isExpired() && !lcs.isInUse()
      );
    const toYMD = (dateFormat) =>
      dateFormat ? time.toYMD(Date.parse(dateFormat)) : "없음";
    return {
      licenses,
      activeLicense,
      setActive,
      navigateToLicensePage,
      filterValidLicense,
      toYMD,
    };
  },
};
</script>

<style lang="scss" scoped>
.licenses {
  font-size: 1.2rem;
  h5 {
    padding: 16px 16px 4px;
  }
  .list {
    padding: 4px 0;
    .each {
      display: flex;
      align-items: center;
      padding: 0px 16px;
      height: 40px;
      cursor: pointer;
      &.active,
      &:hover {
        background-color: #a4dcff;
      }
      .name {
        flex: 1 1 auto;
      }
      button {
        margin-left: 8px;
      }
    }
    .no-items-message {
      // Styling for the message when the list is empty
      padding: 16px; // Provide some spacing
      text-align: center;
      color: #777; // A subtle text color for the message
    }
    .management-link-section {
      // Styling for the section with a link to another page (akin to .reg-stud)
      padding: 16px;
      border-top: 1px solid #cdcdcd; // Separator line, same as .reg-stud in StudentList.vue
      p {
        display: flex; // Aligns text and button on the same line
        justify-content: space-between; // Pushes text to left, button to right
        align-items: center; // Vertically centers text and button
        margin: 0; // Removes default paragraph margin to prevent extra space
      }
    }
  }
}
</style>

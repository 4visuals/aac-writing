<template>
  <div class="lcs-issue-view">
    <div class="search-box">
      <DropDown
        :items="users"
        :fomat="(user) => `${user.name}(${user.email})`"
        @typing="search"
        v-slot:default="{ item: user, setText }"
      >
        <div
          class="user"
          @click="
            () => {
              userSelected(user);
              setText(user.email);
            }
          "
        >
          {{ user.name }}({{ user.email }})
        </div>
      </DropDown>
    </div>
    <div class="license-view" v-if="activeUser">
      <h3>{{ activeUser.name }}</h3>
      <div class="license-ctrl">
        <AacButton
          :inline="true"
          borderless
          rect
          theme="blue"
          text="신규발급"
          size="xs"
          muted
          @click="popupModal"
        ></AacButton>
      </div>
      <div class="licenses">
        <LicenseConfigView :licenses="licenses" :students="students" />
      </div>
    </div>
    <teleport to="body" v-if="modal">
      <Modal @hidden="() => (modal = null)">
        <component
          :is="modal.comp"
          v-bind="{ ...modal.args }"
          v-on="{ ...modal.events }"
        />
      </Modal>
    </teleport>
  </div>
</template>

<script>
import LicenseConfigView from "@/components/admin/LicenseConfigView.vue";
import NewLicenseForm from "./NewLicenseForm.vue";
import { DropDown } from "@/components/form";
import { ref, shallowRef } from "@vue/reactivity";
import adminApi from "../../service/admin-api";
/**
 * 라이선스 발급 화면
 */
export default {
  components: {
    DropDown,
    LicenseConfigView,
    NewLicenseForm,
  },
  setup() {
    const users = ref([]);

    const activeUser = ref(null);
    const licenses = ref([]);
    const students = ref([]);
    const modal = shallowRef(null);
    const userSelected = (user) => {
      adminApi.member.licenses(user.seq).then((res) => {
        licenses.value = res.licenses;
        students.value = res.students;
        activeUser.value = user;
      });
    };
    const search = (keyword) => {
      if (keyword.trim().length === 0) {
        return;
      }
      adminApi.member.search(keyword).then((res) => {
        users.value = res.members;
      });
    };
    const licenseCreated = (newLicenses) => {
      licenses.value.push(...newLicenses);
    };
    const popupModal = () => {
      modal.value = {
        comp: NewLicenseForm,
        args: { user: activeUser.value },
        events: { created: licenseCreated },
      };
    };
    return {
      users,
      activeUser,
      licenses,
      students,
      modal,
      userSelected,
      search,
      popupModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.lcs-issue-view {
  .search-box {
    .user {
      padding: 4px 8px;
    }
  }
  .license-view {
    padding-right: 8px;
    h3 {
      font-size: 1.25rem;
    }
    .license-ctrl {
      display: flex;
    }
    .licenses {
      border: 1px solid #dcdcdc;
      border-radius: 8px;
    }
  }
}
</style>

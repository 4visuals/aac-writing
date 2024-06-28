<template>
  <div class="lcs-issue-view">
    <div class="search-box">
      <DropDown
        :items="users"
        :fomat="(user) => `${user.name}(${user.email})`"
        placeholder="선생님 이메일 또는 이름"
        @typing="search"
        @clear="clearSearch"
        @navigate="startNavigation"
        @move="moveBy"
        @commit="showUserDetail"
        v-slot:default="{ item: user, setText }"
      >
        <div
          class="user"
          :class="{ focused: user === focusedUserRef }"
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
      <div class="licenses" v-if="licenses && licenses.length > 0">
        <LicenseConfigView
          :readOnly="true"
          :orders="orders"
          :licenses="licenses"
          :students="students"
          :teacher="activeUser"
          @update-expiry="updateExpiry"
        />
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

<script setup>
import LicenseConfigView from "@/components/admin/LicenseConfigView.vue";
import { DropDown } from "@/components/form";
import { ref, shallowRef } from "@vue/reactivity";
import adminApi from "../../service/admin-api";
import { time } from "@/service/util";
import License from "@/entity/license";
import Order from "../../../../entity/order";
import toast from "../../../../components/toast";
/**
 * 라이선스 발급 화면
 */
const users = ref([]);
const focusedUserRef = shallowRef(null);
const activeUser = ref(null);
const orders = shallowRef([]);
/** @type {Ref<License[]>} */
const licenses = shallowRef([]);
const students = ref([]);
const modal = shallowRef(null);
const userSelected = (user) => {
  adminApi.member.licenses(user.seq).then((res) => {
    orders.value = res.orders.map((order) => new Order(order));
    res.students.forEach((student) => {
      const ymd = student.birth.split("-");
      student.birth = time.birthToDate(ymd);
    });
    licenses.value = res.licenses.map((lcs) => new License(lcs));
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
const clearSearch = () => {
  users.value = null;
};
const startNavigation = () => {
  focusedUserRef.value = users.value[0];
};
const moveBy = (delta) => {
  if (!focusedUserRef.value) {
    return;
  }
  const userList = users.value;
  const focused = focusedUserRef.value;
  const idx = userList.findIndex((user) => user === focused);
  const nextIdx = (idx + delta + userList.length) % userList.length;
  focusedUserRef.value = userList[nextIdx];
};
const showUserDetail = (e) => {
  if (!focusedUserRef.value) {
    return;
  }
  userSelected(focusedUserRef.value);
  clearSearch();
  e.setText(focusedUserRef.value.email, true);
};
const updateExpiry = (e) => {
  const { order, expDate } = e;
  console.log(expDate, order);
  const utcTimeText = order.replaceExpiryDate(expDate);
  adminApi.order.group
    .updateExpiration(order.order.seq, order.orderUuid, utcTimeText)
    .then(() => {
      order.setExpiredTime(utcTimeText);
      const value = licenses.value;
      licenses.value = value;
      toast.success(`[성공] 만료일 변경`);
    });
};
</script>

<style lang="scss" scoped>
.lcs-issue-view {
  .search-box {
    .user {
      padding: 4px 8px;
      &.focused {
        background-color: #ececec;
      }
    }
  }
  .license-view {
    padding-right: 8px;
    h3 {
      font-size: 1.25rem;
      margin: 8px 0;
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

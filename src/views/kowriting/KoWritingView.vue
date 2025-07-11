<template>
  <div class="subpage">
    <iframe
      v-if="iframeUrl"
      :src="iframeUrl"
      frameborder="0"
      width="100%"
      height="100%"
    ></iframe>
    <div v-else>...loading</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import env from "../../service/env";
import { useStore } from "vuex";

const store = useStore();
const user = store.getters["user/currentUser"];
const host = env.GREAMHANGLE_HOST;

console.log(`[user]`, user);

const iframeUrl = ref(""); // iframe src를 위한 ref

// localStorage key
const STORAGE_KEY = "kowriting_link";

const getStoredLink = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const setStoredLink = (link) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(link));
};

const sendNewLinkRequest = async () => {
  try {
    const response = await fetch(`${host}/kowriting`, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        userSeq: user.seq,
        userName: user.userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    // 24시간 후 만료 시간 계산 (ms 단위)
    const exp_time = Date.now() + 24 * 60 * 60 * 1000;
    const link = { url: data.url, exp_time };
    setStoredLink(link);
    iframeUrl.value = `${host}/kowriting/premium/${link.url}`;
  } catch (error) {
    console.error("POST 실패:", error);
    alert("요청 실패: " + error.message);
  }
};
onMounted(() => {
  const link = getStoredLink();
  const now = Date.now();
  if (link && link.exp_time > now) {
    iframeUrl.value = `${host}/kowriting/premium/${link.url}`;
  } else {
    sendNewLinkRequest();
  }
});
</script>

<style lang="scss" scoped>
.subpage {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}
</style>

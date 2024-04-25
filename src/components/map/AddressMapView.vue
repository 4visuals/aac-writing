<template>
  <section>
    <div class="field">
      <button class="nude floating" @click="$emit('close')">
        <AppIcon icon="close" fsize="14px" /><span>닫기</span>
      </button>
      <input
        class="field"
        type="text"
        placeholder="예) 서울시 도봉구 방학동, 서울시 마포구 홍익로"
        @input="doSearch"
      />
    </div>
    <div class="map-wrapper">
      <div class="map" ref="mapEl"></div>
      <div v-if="searchResponsRef?.activeResult" class="guide">
        <ol>
          <li>
            <p>
              <span>지도를 드래그해서 건물 위에</span><AppIcon icon="place" />
              <span>를 올립니다.</span>
            </p>
          </li>
          <li>
            <p><span class="desc">주소확인</span><span>을 클릭합니다.</span></p>
          </li>
        </ol>
      </div>
      <div v-if="searchResponsRef" class="slide-menu">
        <AddressSearchResultView :search-response="searchResponsRef" />
      </div>
      <button @click="searchResponsRef.queryAddress()" class="nude picker">
        <AppIcon icon="place" fsize="24px" />
        <span class="desc">주소확인</span>
      </button>
      <AddressInputView
        v-if="searchResponsRef?.delivery"
        :search-response="searchResponsRef"
        @success="fillAddress"
      />
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, shallowRef, defineEmits } from "vue";
import { AddressSearchResponse } from "./map-search";
import AddressSearchResultView from "./AddressSearchResultView.vue";
import AddressInputView from "./AddressInputView.vue";
import AppIcon from "../AppIcon.vue";

const emits = defineEmits(["delivery"]);
const mapEl = shallowRef(undefined);
let kakaoMap;
let geocoder;
let searchResponsRef = ref(undefined);
const searchPlaces = (keyword) => {
  geocoder.addressSearch(keyword, (results, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      searchResponsRef.value.setResults(results);
    } else {
      searchResponsRef.value.setError(true);
    }
  });
};
let timer;
const doSearch = (e) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const keyword = e.target.value;
    searchPlaces(keyword);
  }, 500);
};
const fillAddress = () => {
  const { delivery } = searchResponsRef.value;
  emits("delivery", delivery);
};

onMounted(() => {
  console.log(mapEl.value);
  var options = {
    center: new window.kakao.maps.LatLng(33.450701, 126.570667),
    level: 10,
  };
  kakaoMap = new window.kakao.maps.Map(mapEl.value, options);
  geocoder = new window.kakao.maps.services.Geocoder();
  console.log(kakaoMap.getLevel());
  searchResponsRef.value = new AddressSearchResponse(kakaoMap, geocoder);
});
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
section {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  height: 100%;

  & > .field {
    position: absolute;
    top: 0px;
    left: 0;
    right: 0;
    width: 100%;
    padding: 8px;
    display: flex;
    z-index: 10;
    display: flex;
    column-gap: 4px;
    .floating {
      white-space: nowrap;
      display: flex;
      align-items: center;
      background-color: #ffffff;
      border: 1px solid #5ba2ff;
      color: #5ba2ff;
      border-radius: 8px;
      font-size: 1rem;
      padding: 6px;
    }
  }
  .map-wrapper {
    flex: 1 1 auto;
    position: relative;
    .map {
      position: absolute;
      inset: 0;
    }
    .guide {
      position: absolute;
      z-index: 10;
      top: 50px;
      right: 8px;
      background-color: #ecff86;
      padding: 8px 8px 8px 0;
      ol {
        margin: 0;
        display: flex;
        row-gap: 4px;
        flex-direction: column;
        li {
          p {
            display: flex;
            align-items: center;
          }
        }
      }
    }
    .slide-menu {
      position: absolute;
      top: 60px;
      left: 8px;
      z-index: 50;
    }
    .desc {
      white-space: nowrap;
      background-color: #3162ff;
      color: white;
      padding: 2px 4px;
      font-weight: 400;
      border-radius: 6px;
      transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .picker {
      z-index: 100;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -100%);
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      opacity: 0.5;
      > .desc {
        position: absolute;
        top: 0;
        left: 50%;
        white-space: nowrap;
        transform: translate(-50%, -100%);
        padding: 2px 4px;
      }
      &:hover {
        opacity: 1;
      }
      &:active {
        transform: translate(-48%, -98%);
      }
    }
  }
}
</style>

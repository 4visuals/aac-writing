<template>
  <div class="products">
    <div class="ctrl">
      <button class="nude green" @click="$emit('create')">
        공구 상품 추가
      </button>
    </div>
    <div class="container-fluid">
      <div class="row">
        <div
          v-for="prod in products"
          :key="prod.code"
          :class="{ beta: prod.beta }"
          class="col-12 col-sm-12 col-md-6 col-lg-4"
        >
          <SectionBox class="product" margin="8px 0">
            <h5>{{ prod.getActivatedDate("YMD") }}</h5>
            <h3>{{ prod.name }}</h3>
            <GroupBuyingDetailView
              :product="prod"
              @forms="(forms) => bindOrderForms(prod, forms)"
            />
            <div class="setting">
              <ActionIcon
                icon="settings"
                fsize="24px"
                fcolor="#777"
                @click="showProductSettingForm(prod)"
              />
            </div>
          </SectionBox>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";
import SectionBox from "@/components/SectionBox.vue";
import GroupBuyingDetailView from "./GroupBuyingDetailView.vue";
import { ActionIcon } from "../../../../components/form";
import GbuyingProductSetting from "./GbuyingProductSetting.vue";
import modal from "@/components/modal";

defineProps({
  products: {
    /** @type { import('vue').PropType<Array<import('../../../../entity/product').default>> } */
    type: Array,
    required: true,
  },
});
const emit = defineEmits({
  /**
   * 상품 만료 시킴
   */
  expire: Object,
  /**
   * 공구 참여자들에게 결제 링크 발송
   */
  ordering: Object,
});
/**
 * 공구 참여 편집창 열기
 * @param {{product: Product, form: GroupOrderForm}} param0
 */

const bindOrderForms = (product, forms) => {
  product.forms = forms;
};

const showProductSettingForm = (product) => {
  modal.showModal(GbuyingProductSetting, {
    width: "sm",
    props: {
      product,
    },
    events: {
      delete: () => emit("expire", product),
      ordering: () => emit("ordering", product),
    },
  });
};
</script>

<style lang="scss" scoped>
.products {
  .product {
    position: relative;
    height: calc(100% - 16px);
    .setting {
      position: absolute;
      top: 4px;
      right: 4px;
    }
  }
}
</style>

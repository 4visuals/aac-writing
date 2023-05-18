<template>
  <div class="product">
    <Transition name="tr-fade">
      <div
        v-if="paymentVisible && hovering"
        class="panel"
        @mouseleave="hover(false)"
      >
        <div class="option">
          <div class="login">
            <p>현재는 단체 구매만 가능합니다.</p>
            <!-- <FormButton text="로그인" @click="$router.push('/')" /> -->
          </div>
        </div>
      </div>
    </Transition>
    <section class="detail" :class="[theme]">
      <h3 class="duration">
        <span class="dur">{{ product.durationInDays }}</span>
        <span class="sub">DAYS</span>
      </h3>
      <div class="price">
        <h5>{{ format(product.priceKrWon) }}원</h5>
        <h4>{{ format(product.price) }}원</h4>
      </div>
      <!-- <h3 class="name">{{ product.name }}</h3> -->
      <div class="desc">그림한글 받아쓰기</div>
      <div class="discount">
        <Baloon width="125px" v-if="product.discountKrWon > 0" class="baloon">
          <div>
            <p>{{ product.name }}</p>
            <h4 class="disc-val">
              {{ product.discountRate.toFixed(0) }}% 할인
            </h4>
          </div>
        </Baloon>
        <div class="logo">
          <component :is="logoComponent[theme]" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Jaum01 from "../../components/char/Jaum01.vue";
import Jaum04 from "../../components/char/Jaum04.vue";
import Jaum05 from "../../components/char/Jaum05.vue";
import Jaum13 from "../../components/char/Jaum13.vue";
import Baloon from "../../components/char/Baloon.vue";
import { defineProps, ref } from "vue";
import util from "../../service/util";
import Product from "../../entity/product";

defineProps({
  product: Product,
  theme: String,
  paymentVisible: { type: Boolean, required: false, default: true },
  minified: { type: Boolean, required: false, default: false },
});
const logoComponent = {
  green: Jaum13,
  "picton-blue": Jaum01,
  yellow: Jaum04,
  violet: Jaum05,
};
const hovering = ref(false);
const format = (money) => util.currency.format(money);
const hover = (on) => {
  hovering.value = on;
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
$r: 40px;
$bsize: 4px;
.product {
  position: relative;
  overflow: hidden;
  padding: 0;
  border-radius: 16px;

  h3 {
    margin: 0;
  }
  .detail {
    position: relative;
    padding: 12px 16px;
    &.green {
      background-color: #1db270;
      .duration {
        color: white;
      }
      .price {
        h5 {
          color: #f4c924;
          text-decoration: line-through;
        }
        h4 {
          color: #163913;
        }
      }
      .discount {
        color: #163913;
      }
    }
    &.picton-blue {
      background-color: #21c2cc;
      .duration {
        color: white;
      }
      .price {
        h5 {
          color: #7b4799;
        }
        h4 {
          color: #132b39;
        }
      }
      .discount {
        color: #132b39;
      }
    }
    &.yellow {
      background-color: #ffd110;
      .duration {
        color: white;
      }
      .price {
        h5 {
          color: #7b4799;
        }
        h4 {
          color: #393113;
        }
      }
      .discount {
        color: #393113;
      }
    }
    &.violet {
      background-color: #9a60e0;
      .duration {
        color: white;
      }
      .price {
        h5 {
          color: #21c2cc;
        }
        h4 {
          color: #1f1339;
        }
      }
      .discount {
        color: #1f1339;
      }
      .desc {
        color: #1f1339;
      }
    }
    .duration {
      font-size: 3rem;
      padding: 24px;
      .dur {
        font-weight: 900;
        margin-right: 12px;
      }
      .sub {
        font-size: 0.8em;
      }
    }
    .price {
      padding: 0px 24px;
      h5 {
        font-size: 1.4rem;
        text-decoration: line-through;
      }
      h4 {
        font-size: 2.2rem;
        font-weight: 900;
      }
    }
    .desc {
      font-size: 1.2rem;
      padding: 24px;
    }
    .discount {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 125px;
      height: 100%;
      right: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .baloon {
        position: absolute;
        top: 24px;
      }

      h4 {
        font-weight: 900;
        margin-bottom: 18px;
      }
      .logo {
        width: 100px;
        position: absolute;
        bottom: 0;
      }
    }
  }
}
@include mobile {
  .product.minified {
    .inner {
      .detail {
        display: none;
      }
    }
  }
}
@include tablet {
  .product.minified {
    .inner {
      .name-only {
        display: none;
      }
    }
  }
}
@include desktop {
  .product.minified {
    .inner {
      .name-only {
        display: none;
      }
    }
  }
}
</style>

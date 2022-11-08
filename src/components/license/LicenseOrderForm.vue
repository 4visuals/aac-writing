<template>
  <div class="order-form">
    <div v-if="isTeacher" class="inner">
      <div v-if="productsRef" class="order">
        <div class="section user">
          <h4>구매자</h4>
          <div class="name">{{ teacher.name }}</div>
          <div class="email">{{ teacher.email }}</div>
        </div>
        <div class="section">
          <h4>상품 목록</h4>
          <p>구매할 수강증을 선택해주세요.</p>
          <ul class="body prod-list">
            <li v-for="prod in productsRef" :key="prod.code" class="prod">
              <div class="info" @click="order.product = prod">
                <h5>{{ prod.name }}</h5>
                <p>{{ prod.description }}</p>
                <table class="price">
                  <tr class="cost">
                    <td>정가</td>
                    <td class="acc">{{ prod.priceKrWon }}</td>
                  </tr>
                  <tr class="disc">
                    <td>할인</td>
                    <td class="acc">{{ prod.discountKrWon }}</td>
                  </tr>
                  <tr class="price">
                    <td>가격</td>
                    <td class="acc">{{ prod.price }}</td>
                  </tr>
                </table>
              </div>
            </li>
          </ul>
        </div>
        <div class="section" v-if="order.product">
          <h4>수량</h4>
          <p>수강증 갯수를 선택해주세요.</p>
          <select v-model="order.qtt">
            <option value="0">[갯수 선택]</option>
            <option v-for="qtt in 20" :key="qtt" :value="qtt">
              {{ qtt }}개
            </option>
          </select>
        </div>
        <div v-if="validOrder(order)" class="section overview">
          <div class="prod">{{ order.product.name }}</div>
          <div class="price">
            <span class="qtt">{{ order.product.price }}원</span
            ><span class="mul">X</span
            ><span class="qtt">{{ order.qtt }}개</span>
          </div>
          <div class="total">{{ order.product.price * order.qtt }} 원</div>
        </div>
        <div v-if="validOrder(order)" class="section">
          <FormButton text="구매하기" size="sm" @click="createOrder" />
        </div>
      </div>
      <LoadingIcon v-else :pending="pending" text="상품 불러오는 중..." />
    </div>
    <div v-else class="not-teacher">교사 계정이 아닙니다.</div>
  </div>
</template>

<script>
import { LoadingIcon } from "@/components";
import { ref, shallowRef } from "vue";
import { useStore } from "vuex";
import api from "../../service/api";
import toast from "../toast";

export default {
  components: {
    LoadingIcon,
  },
  setup() {
    const store = useStore();
    const teacher = store.getters["user/currentUser"];
    const isTeacher = store.getters["user/isTeacher"];
    const productsRef = shallowRef(null);
    const order = ref({
      product: null,
      qtt: 0,
    });
    const pending = ref({
      text: "상품 불러오는 중...",
      error: false,
    });

    const validOrder = (order) => {
      return order.product && order.qtt > 0;
    };
    const createOrder = () => {
      const { product, qtt } = order.value;
      api.order
        .createBeta(product.code, qtt)
        .then((res) => {
          console.log(res);
          store.commit("user/addLicenses", res.order.items);
          toast.success("(평가판)수강증이 발급되었습니다.", "수강증", 5);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const createOrderByImport = (order) => {
      const imp = window.IMP;
      imp.init("imp20450844");
      console.log(order);
      // imp20450844
      const merchant_uid =
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2);
      imp.request_pay(
        {
          // param
          pg: "danal_tpay.9810030929",
          pay_method: "card",
          merchant_uid,
          name: order.product.name,
          amount: 100,
          buyer_email: "yeori.seo@gmail.com",
          buyer_name: "서채민",
        },
        (res) => {
          // callback
          if (res.success) {
            console.log("[SUCCESS]", res);
            // 결제 성공 시 로직,
          } else {
            console.log("[FAILURE]", res);
            // 결제 실패 시 로직,
          }
        }
      );
    };
    const loadProducts = () => {
      pending.value.state = "LOADING";
      api.product
        .list()
        .then((res) => {
          productsRef.value = res.products;
          pending.value = null;
        })
        .catch((err) => {
          pending.value = { text: err.cause, error: true };
        });
    };

    loadProducts();
    return {
      productsRef,
      order,
      pending,
      teacher,
      isTeacher,
      validOrder,
      createOrder,
      createOrderByImport,
    };
  },
};
</script>

<style lang="scss" scoped>
.order-form {
  max-width: 400px;
  .order {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    .section {
      h4 {
        font-size: 1.2rem;
      }
      p {
        margin: 4px 0;
      }
    }
    .prod-list {
      list-style: none;
      padding-left: 0;
      margin: 0;
      .prod {
        user-select: none;
        padding: 4px 8px;
        cursor: pointer;
        background-color: #efefef;
        border: 1px solid #dcdcdc;
        .price {
          margin-left: auto;
          td {
            padding: 1px 2px;
            &.acc {
              text-align: right;
            }
          }
        }
      }
    }
    .overview {
      padding: 8px;
      background-color: rgb(221, 255, 210);
      border: 1px solid #1fbb01;
      .price {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        column-gap: 8px;
      }
      .total {
        text-align: right;
        font-size: 1.25rem;
        font-weight: 600;
      }
    }
  }
}
</style>

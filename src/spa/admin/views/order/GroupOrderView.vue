<template>
  <div>
    <h3>단체 구매 요청</h3>
    <div class="orders container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="types">
            <label v-for="state in states" :key="state.type"
              ><input
                type="checkbox"
                v-model="search.type"
                :value="state.type"
              />{{ state.label }}</label
            >
          </div>
        </div>
      </div>
      <div class="row">
        <div
          v-if="filteredOrders && filteredOrders.length === 0"
          class="col-12"
        >
          단체 문의가 없습니다.
        </div>
        <div
          v-for="order in filteredOrders"
          class="col-sm-12 col-md-6 col-lg-4"
          :key="order.seq"
        >
          <div class="order">
            <table class="table">
              <tr>
                <td class="col" colspan="2">
                  <span class="state" :class="order.state">{{
                    order.stateText
                  }}</span>
                </td>
              </tr>
              <tr>
                <td class="col">등록시간</td>
                <td>{{ order.creationTimeKr }}</td>
              </tr>
              <tr>
                <td class="col">요청인</td>
                <td>
                  <ul>
                    <li>{{ order.senderName }}</li>
                    <li>이메일: {{ order.sender.email }}</li>
                    <li>{{ order.senderContactInfo }}</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td class="col">조직</td>
                <td>
                  {{ order.orgName }}(email: {{ order.orgEmail || "미입력" }})
                </td>
              </tr>
              <tr>
                <td class="col">내용</td>
                <td>{{ order.content }}</td>
              </tr>
              <tr>
                <td class="col">증빙서류</td>
                <td>
                  <div v-if="order.papers.length === 0" class="none">없음</div>
                  <ul>
                    <li v-for="(p, idx) in order.papers" :key="idx">
                      {{ paperName(p) }}
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td class="col"></td>
                <td v-if="order.state === 'PND'" class="btns">
                  <button class="nude blue" @click="showSmsForm(order)">
                    SMS
                  </button>
                  <button class="nude green" @click="showLicenseForm(order)">
                    발급
                  </button>
                  <button class="nude red" @click="showCancelModal(order)">
                    취소
                  </button>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from "vue";
import { useStore } from "vuex";
import adminApi from "../../service/admin-api";
import modal from "@/components/modal";
import DialogView from "@/components/dialog/DialogView.vue";
import NewGroupLicenseForm from "../license/NewGroupLicenseForm.vue";
import SmsPublishingForm from "../../comp/sms/SmsPublishingForm.vue";
import Product from "../../../../entity/product";
import { GroupOrderState } from "../../../../entity/group-order-form";

export default {
  setup() {
    const store = useStore();
    const states = Object.keys(GroupOrderState).map((prop) => ({
      type: prop,
      label: GroupOrderState[prop],
    }));
    const search = reactive({
      type: ["PND"],
    });
    const orders = ref([]);
    const filteredOrders = computed(() =>
      orders.value.filter((odr) => search.type.includes(odr.state))
    );
    const products = ref(null);

    const paperNames = {
      EST: "견적서",
      CBR: "사업자등록증",
      BNK: "통장 사본",
    };
    const paperName = (paper) => paper.desc || paperNames[paper.paperType];
    adminApi.order.group.list().then((res) => {
      orders.value = res.orders;
    });
    const doCancelOrder = (cmd, order) => {
      console.log("[cancel]");
      if (cmd === "yes") {
        adminApi.order.group.cancel(order.seq).then(() => {
          const idx = orders.value.findIndex((odr) => odr.seq === order.seq);
          orders.value.splice(idx, 1);
        });
      }
      modal.closeModal();
    };
    const showSmsForm = (order) => {
      modal.showModal(SmsPublishingForm, {
        width: "sm",
        props: { order, products },
      });
    };
    const showLicenseForm = (order) => {
      modal.showModal(NewGroupLicenseForm, {
        width: "sm",
        props: { order, products },
      });
    };

    const showCancelModal = (order) => {
      store.commit("ui/hideMenu");
      modal.showModal(DialogView, {
        width: "sm",
        props: {
          title: "시스템 취소",
          message: "단체 주문을 [시스템 취소]합니까?",
          actions: [
            { cmd: "yes", text: "취소합니다." },
            { cmd: "no", text: "아니오" },
          ],
        },
        events: { commit: (cmd) => doCancelOrder(cmd, order) },
      });
    };
    const filtered = () => {
      console.log(search);
      if (!orders.value) {
        return [];
      }
      return orders.value.filter((order) => search.type.includes(order.state));
    };
    const loadProduct = () => {
      adminApi.product.list().then((res) => {
        // B:베타 테스트용, S: 정식 판매용
        // 유효 기간도 넣어야 함
        products.value = res.products
          .filter((prod) => prod.type !== "B")
          .map((prod) => new Product(prod));
      });
    };
    loadProduct();
    return {
      search,
      states,
      orders,
      filteredOrders,
      products,
      paperName,
      showSmsForm,
      showLicenseForm,
      showCancelModal,
      filtered,
    };
  },
};
</script>

<style lang="scss" scoped>
.orders {
  .types {
    display: flex;
    column-gap: 16px;
    padding: 8px 0;
    label {
      display: inline-flex;
      align-items: center;
      column-gap: 4px;
    }
  }
  .order {
    padding: 8px 0;

    .table {
      box-shadow: 2px 2px 8px 0 #0000002d;
      width: 100%;
      border-radius: 8px;
      tr {
        padding: 2px;
      }
      td {
        vertical-align: top;
        padding: 2px;
        &.col {
          white-space: nowrap;
          padding-left: 8px;
        }
        &.btns {
          button {
            border-radius: 8px;
          }
          button + button {
            margin-left: 8px;
          }
        }
        .state {
          padding: 4px;
          margin-right: 8px;

          &.PND {
            background-color: #efefef;
          }
          &.CMT {
            background-color: #acff38;
          }
          &.CBU {
            background-color: #ffd102;
          }
          &.CBS {
            background-color: #ff5111;
            color: white;
          }
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
      }
    }
  }
}
</style>

<template>
  <div>
    <h3>단체 구매 요청</h3>
    <div class="orders">
      <div v-for="order in orders" class="order" :key="order.seq">
        <table class="table">
          <tr>
            <td colspan="2">
              <span class="state" :class="order.state">대기중</span>
            </td>
          </tr>
          <tr>
            <td>등록시간</td>
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
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import adminApi from "../service/admin-api";
export default {
  setup() {
    const orders = ref(null);
    const paperNames = {
      EST: "견적서",
      CBR: "사업자등록증",
      BNK: "통장 사본",
    };
    const paperName = (paper) => paper.desc || paperNames[paper.paperType];
    adminApi.order.group.list().then((res) => {
      orders.value = res.orders;
    });
    return { orders, paperName };
  },
};
</script>

<style lang="scss" scoped>
.orders {
  .order {
    border: 1px solid #aaa;
    max-width: 400px;
    padding: 8px;
    margin-bottom: 16px;
    .table {
      td {
        vertical-align: top;
        padding: 2px;
        &.col {
          white-space: nowrap;
        }
        .state {
          padding: 4px;
          margin-right: 8px;

          &.PND {
            background-color: #efefef;
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

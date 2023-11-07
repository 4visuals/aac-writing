import { GET, POST, PUT, DELETE } from "@/service/api/request";
import { GroupOrderForm } from "../../../entity/group-order-form";
import Product from "../../../entity/product";
const admin = {
  authenticate: () => POST("/admin/auth"),
};
const member = {
  search: (keyword) => GET(`/admin/member`, { keyword }),
  licenses: (teacherSeq) => GET(`/admin/member/${teacherSeq}/licenses`),
};

const license = {
  create: (userSeq, numOfLicense) =>
    POST(`/admin/license`, { userSeq, qtt: numOfLicense }),
};

const order = {
  list: () => GET("/admin/orders"),
  /**
   * 단체 구매 관련 api
   */
  group: {
    cancel: (orderSeq) =>
      PUT(`/admin/group-orders/${orderSeq}/CBS`).then((res) => {
        res.order = new GroupOrderForm(res.order);
        return res;
      }),
    list: () =>
      GET("/admin/group-orders").then((res) => {
        res.orders = res.orders.map((order) => new GroupOrderForm(order));
        return res;
      }),
    /**
     * 단체 주문에 대한 이용권 발급
     * @param {number} groupOrderSeq
     * @param {string} productCode
     * @param {number} qtt
     * @param {number} contractPrice
     * @returns
     */
    commit: (groupOrderSeq, productCode, qtt, contractPrice) =>
      POST(`/admin/group-orders/`, {
        groupOrderSeq,
        productCode,
        qtt,
        contractPrice,
      }),
    /**
     * 전송 문자 미리보기
     */
    sms: {
      preview: (uuid, templateName) =>
        GET(`/admin/sms/group-order/${uuid}/${templateName}/preview`),
      send: (uuid, templateName) =>
        POST(`/admin/sms/group-order/${uuid}/${templateName}`),
      sendManual: (uuid, body) =>
        POST(`/admin/sms/group-order/${uuid}/manual`, { body }),
    },
  },
  /**
   * 공동 구매 관련 api
   */
  gbuying: {
    /**
     * 주어진 공구 상품의 공구 주문 양식 조회(실제 주문이 아님)
     * @param {String} productCode 상품 uuid
     * @returns
     */
    listOrderForms: (productCode) =>
      GET(`/admin/gbuying/product/${productCode}/forms`).then((res) => {
        return res.forms.map((form) => GroupOrderForm.fromGroupBuying(form));
      }),
    addForm: (form) =>
      POST(`/admin/gbuying/form`, form).then((res) => {
        return GroupOrderForm.fromGroupBuying(res.form);
      }),
    /**
     * 공구 참여 양식 수정 (수량, 갯수만)
     * @param {number} formSeq
     * @param {{price:string, qtt: string}} body
     * @returns
     */
    updateForm: (formSeq, body) =>
      PUT(`/admin/gbuying/form/${formSeq}`, body).then((res) =>
        GroupOrderForm.fromGroupBuying(res.form)
      ),
    deleteForm: (formSeq) => DELETE(`/admin/gbuying/form/${formSeq}`),
  },
};

const product = {
  list: () =>
    GET("/admin/products").then((res) => {
      res.products = res.products.map((prod) => new Product(prod));
      return res;
    }),
  create: (product) =>
    POST("/admin/product", product).then((res) => {
      res.product = new Product(res.product);
      return res;
    }),
  update: (product) =>
    PUT("/admin/product", product).then((res) => {
      res.product = new Product(res.product);
      return res;
    }),
};
export default { admin, member, license, order, product };

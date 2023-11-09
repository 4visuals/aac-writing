import env from "@/service/env";
import api from "../api";

export class PortOneParam {
  constructor(loginUser, product, order, method) {
    this.loginUser = loginUser;
    this.product = product;
    this.order = order;
    this.method = method;
  }
}
/**
 * PortOne 결제 wrapper
 */
export class PortOne {
  constructor(param) {
    this.param = param;
  }
  sendVerificationCode() {
    const { order } = this.param;
    return api.order.prepare(order.getUuid()).then(() => {
      return this;
    });
  }
  startPayment() {
    const { loginUser, product, order, method } = this.param;
    const imp = window.IMP;
    imp.init(env.IMPORT_ACCOUNT);
    const merchant_uid = order.getUuid();
    const { origin } = document.location;
    const redirectUrl = `${origin}/purchase/order/checking`;
    return new Promise((success, failed) => {
      imp.request_pay(
        {
          // param
          pg: env.IMPORT_PGNAME,
          pay_method: method,
          merchant_uid,
          name: product.name,
          amount: order.totalAmount,
          buyer_email: loginUser.email,
          buyer_name: loginUser.name,
          m_redirect_url: redirectUrl,
          notice_url: env.IMPORT_HOOK,
        },
        (res) => {
          // callback
          if (res.success) {
            success(res);
            // 결제 성공 시 로직,
          } else {
            failed(res);
          }
        }
      );
    });
  }
}

export class PortOneMocking extends PortOne {
  startPayment() {
    return Promise.resolve({
      success: true,
      imp_uid: "imp_846369313995",
      pay_method: "card",
      merchant_uid: "odr-89616df8-cec4-403b-bb98-06e913431fe6",
      name: "테스트 제품명",
      paid_amount: 45000,
      currency: "KRW",
      pg_provider: "uplus",
      pg_type: "payment",
      pg_tid: "tlgda202311091941ig82432",
      apply_num: "00000000",
      buyer_name: "테스터",
      buyer_email: "test.er@gmail.com",
      buyer_tel: "",
      buyer_addr: "",
      buyer_postcode: "",
      custom_data: null,
      status: "paid",
      paid_at: 1699526470,
      receipt_url:
        "http://pgweb.dacom.net:7085/pg/wmp/etc/jsp/Receipt_Link.jsp?mertid=tlgdacomxpay&tid=tlgda20231109194110Lq5G6&authdata=46b5a5bc46307df7d23ee07509a63bb1",
      card_name: "XX카드",
      bank_name: null,
      card_quota: 0,
      card_number: "___abcd__xxxx",
    });
  }
}

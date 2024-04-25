import util from "../service/util";
const SALES_TYPES = "RT,GB".split(",");
/**
 * @class
 * @public
 * @property {string} code - uuid
 */
class Product {
  /**
   *
   * @param {Product} data
   */
  constructor(data) {
    Object.keys(data).forEach((prop) => {
      this[prop] = data[prop];
    });
  }
  get taxFree() {
    const { tax } = this;
    if (!tax) {
      throw new Error("tax is required. 'Y' or 'N'");
    }
    return tax === "N";
  }
  get offline() {
    return this.digitalType === "N";
  }
  /**
   * 최종 상품 금액(상품가 - 할인가)
   */
  get price() {
    const { discountKrWon, priceKrWon } = this;
    return priceKrWon - discountKrWon;
  }
  get durationInDays() {
    return this.durationInHours / 24;
  }
  get discountRate() {
    const { discountKrWon, priceKrWon } = this;
    return (discountKrWon / priceKrWon) * 100;
  }
  /**
   * 면세가액 반환
   * @returns 면세 상품이면 전체 상품 금액 반환, 과세 상품이면 0 반환
   */
  getTaxAmount() {
    if (this.taxFree) {
      return this.price;
    } else {
      return 0;
    }
  }
  getActivatedDate(format) {
    const d = new Date(this.activatedAt);
    if (format === "YMD") {
      return util.time.toYMD(d);
    } else {
      return d;
    }
  }
  isRetail() {
    return this.salesType === "RT";
  }
  isGroupBuying() {
    return this.salesType === "GB";
  }
  setAsRetail() {
    this.salesType = "RT";
  }
  setAsGroupBuying() {
    this.salesType = "GB";
  }
  setSalesType(salesType) {
    const value = SALES_TYPES.find((v) => v === salesType);
    if (!value) {
      throw new Error("sales type: " + salesType + ". usee one of [RT, GB]");
    }
    this.salesType = value;
  }
}

export default Product;

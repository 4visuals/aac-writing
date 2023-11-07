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

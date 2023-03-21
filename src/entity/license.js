import util from "@/service/util";

const copyProps = (obj, lcs) => {
  Object.keys(lcs).forEach((prop) => {
    obj[prop] = lcs[prop];
  });
};
class License {
  constructor(lcs) {
    this._src = lcs;
    copyProps(this, lcs);
  }
  get status() {
    if (this.isInUse()) {
      return "USING";
    } else if (this.isExpired()) {
      return "EXPIRED";
    } else {
      return "READY";
    }
  }
  /**
   * 수강증 유효기간이 남았는지 확인
   * @returns
   */
  isAvailable() {
    return !this.isExpired();
  }
  getExpiredTimeMillis() {
    const exp = this.expiredAt;
    if (!exp) {
      return null;
    } else if (typeof exp === "number") {
      return exp;
    } else {
      // ISO 8601 이겠재? - YYYY-MM-DDTHH:mm:ssZ
      return Date.parse(exp);
    }
  }
  isInUse() {
    return !this.isExpired() && this.alreadyActivated && this.studentRef;
  }
  isExpired() {
    const { expiredAt } = this;
    if (!expiredAt) {
      return false;
    }
    const exp = this.getExpiredTimeMillis();
    return exp < new Date().getTime();
  }
  toTimeText(prop) {
    const time = this[prop];
    return util.time.toYMD(Date.parse(time));
  }
}
export default License;

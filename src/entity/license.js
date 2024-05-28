import util from "@/service/util";

const copyProps = (obj, lcs) => {
  Object.keys(lcs).forEach((prop) => {
    obj[prop] = lcs[prop];
  });
};
export class License {
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
  /**
   * 이용 중인 수강증인지 나타냄
   * 1) 만료되지 않아야 하고
   * 2) 연결된 학생이 있음.
   * @returns
   */
  isInUse() {
    /**
     * 이용권 활성화 규칙이 변경됨
     * 이전에는 이용권에 학생을 연결할때 활성화되었으나,
     * 이용권이 발급된 직후에 곧바로 활성화시킴.
     *
     * 여기서의 [활성화]는 구매한 이용권의 사용 시작 시간을 의미함.
     * 학생 등록과 상관없이 구매 직후부터 사용중 처리됨
     */
    return !this.isExpired() && /* this.alreadyActivated && */ this.studentRef;
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

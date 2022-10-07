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
   * 수강증이 사용중인지 나타냄
   * @returns
   */
  isInUse() {
    return (
      !this.isExpired() &&
      this.alreadyActivated &&
      this.expiredAt &&
      this.studentRef
    );
  }
  isExpired() {
    const { expiredAt } = this;
    return expiredAt && expiredAt < new Date().getTime();
  }
}
export default License;

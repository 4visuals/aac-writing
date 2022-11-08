class Product {
  constructor(data) {
    Object.keys(data).forEach((prop) => {
      this[prop] = data[prop];
    });
    // this._data = data;
  }
  get price() {
    const { discountKrWon, priceKrWon } = this;
    return priceKrWon - discountKrWon;
  }
  get durationInDays() {
    return this.durationInHours / 24;
  }
}

export default Product;

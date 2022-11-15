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
  get discountRate() {
    const { discountKrWon, priceKrWon } = this;
    return (discountKrWon / priceKrWon) * 100;
  }
}

export default Product;

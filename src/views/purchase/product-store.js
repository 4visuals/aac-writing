import store from "@/store";
import api from "../../service/api";

class ProductStore {
  producsts;
  onlines;
  offlines;
  constructor() {}
}
export const productStore = new ProductStore();

store.registerModule("product", {
  namespaced: true,
  state: productStore,
  getters: {
    onlineProducts: (state) => state.onlines,
    bookProduct: (state) => state.offlines[0],
  },
  mutations: {
    setProduct(state, products) {
      state.products = products;
      state.onlines = products.filter((prod) => !prod.offline);
      // // FIXME 테스트용
      // const book = new Product({
      //   name: "[테스트]교재",
      //   code: "prod-cert-65a44155-88c2-4cd8-a302-0744fd84a34b",
      //   priceKrWon: 120000,
      //   discountKrWon: 0,
      //   description: "그림한글 받아쓰기 교재 세트 3권",
      //   type: "S",
      //   durationInHours: 720,
      //   theme: "green",
      //   salesType: "RT",
      //   trialProduct: false,
      //   beta: false,
      // });
      state.offlines = products.filter((prod) => prod.offline);
    },
  },
  actions: {
    loadProduct: (ctx) => {
      api.product.list().then((res) => {
        ctx.commit("setProduct", res.products);
      });
    },
  },
});

store.dispatch("product/loadProduct");

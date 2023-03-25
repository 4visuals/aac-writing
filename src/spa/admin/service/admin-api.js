import { GET, POST, PUT } from "@/service/api/request";
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
  group: {
    list: () =>
      GET("/admin/group-orders").then((res) => {
        res.orders = res.orders.map((order) => new GroupOrderForm(order));
        return res;
      }),
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

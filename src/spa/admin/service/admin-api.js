import { GET, POST } from "@/service/api/request";
import Product from "../../../entity/product";

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
};

const product = {
  list: () =>
    GET("/admin/products").then((res) => {
      res.products = res.products.map((prod) => new Product(prod));
      return res;
    }),
  create: (product) => POST("/admin/product", product),
};
export default { member, license, order, product };

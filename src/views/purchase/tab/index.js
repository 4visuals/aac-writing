import { TabModel } from "../../../components/tab";
export const productTabs = TabModel.create([
  { text: "이용권", cmd: "license", clazz: "edit" },
  { text: "연습공책", cmd: "book", clazz: "edit" },
  { text: "단체구매", cmd: "groupOrder", clazz: "edit" },
]);

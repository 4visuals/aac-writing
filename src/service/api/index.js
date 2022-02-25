import { GET } from "./request";

const chapter = {
  list: (origin) => GET(`/chapters/origin/${origin}`),
};
const section = {
  levels: () => GET("/dictations/level"),
};

export { section };

export default { chapter, section };

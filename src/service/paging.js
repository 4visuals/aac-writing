export class PageBox {
  /** @type {number} page offset */
  offset;
  /** @type {boolean} */
  active;
  /** @type {number} */
  total;
  /** @type {Paging} */
  paging;
  constructor(offset, active, paging) {
    this.offset = offset;
    this.active = active;
    this.paging = paging;
  }
  get pageNum() {
    return this.offset + 1;
  }
  isEnd() {
    return this.offset + 1 >= this.paging.chunkCount;
  }
}
export class Paging {
  /** @type {number} 전체 갯수*/
  total;
  /** @type {number} 한 페이지당 item 갯수*/
  pageSize;
  /** @type {number} 현재 아이템 인덱스(0-base index) */
  pos;

  constructor(total, pageSize = 20) {
    this.total = total;
    this.pageSize = pageSize;
    this.pos = 0;
  }
  get pageOffset() {
    return Number.parseInt(this.pos / this.pageSize);
  }
  /** @type {number} 전체 chunk(page) 갯수 */
  get chunkCount() {
    const tail = this.total % this.pageSize > 0;
    return Number.parseInt(this.total / this.pageSize) + tail;
  }
  get pageBox() {
    const range = 3;
    const len = 2 * range + 1;
    const offset = this.pageOffset;
    const min = Math.max(0, offset - range);
    const boxes = [];
    for (let k = 0; k < len; k++) {
      const box = new PageBox(k + min, k + min === offset, this);
      boxes.push(box);
      if (box.isEnd()) {
        break;
      }
    }
    return boxes;
  }
  get range() {
    // const pageOffset = Number.parseInt(this.pos / this.pageSize);
    const start = this.pageOffset * this.pageSize;
    const end = Math.min(this.total, start + this.pageSize);
    return [start, end];
  }
  setPage(pageIndex) {
    this.pos = this.pageSize * pageIndex;
  }
  reset(total) {
    this.total = total;
    this.pos = 0;
  }
}

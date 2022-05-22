class Storage {
  constructor(storage) {
    this.storage = storage;
  }
  read(key, auxValue) {
    const { storage } = this;
    const value = storage.getItem(key);
    if (value) {
      return JSON.parse(value);
    } else {
      return auxValue || value;
    }
  }
  write(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  }
  remove(key) {
    this.storage.removeItem(key);
  }
  clear() {
    this.storage.clear();
  }
}

const local = new Storage(localStorage);
const session = new Storage(sessionStorage);
export default {
  local,
  session,
};

import util from "../../service/util";

export class DeliveryInfo {
  legacy;
  /** @type {{address_name: string, building_name: string, zone_no: string}} 도로명 주소 */
  road;
  /** @type {string} 상세 주소 */
  detailAddress;
  /** @type {string} 받는 사람 */
  receiverName;
  /**
   * @type {string} 사용자가 입력한 기본주소. 검색한 기본주소 대신에 쓰임
   */
  _userDefinedBaseAddress;
  /** @type {string} */
  phoneNumber;
  constructor(legacy, road) {
    this.legacy = legacy;
    this.road = road;
    this.detailAddress = undefined;
    this.receiverName = undefined;
  }
  get zipCode() {
    return this.road ? this.road.zone_no : "";
  }
  get baseAddress() {
    const { road } = this;
    if (this._userDefinedBaseAddress) {
      return this._userDefinedBaseAddress;
    } else if (road) {
      const { address_name, building_name } = road;
      return `${address_name} ${building_name}`;
    } else {
      return "도로명 주소 없음";
    }
  }
  valid() {
    return this.road && this.detailAddress && this.receiverName;
  }
  setDetailAddress(/** @type {string} */ address) {
    const addr = address ? address.trim() : undefined;
    this.detailAddress = addr;
  }
  setReceiverName(/** @type {string} */ receiverName) {
    this.receiverName = receiverName;
  }
  /**
   * 검색한 기본 주소를 수정함
   * @param {string} baseAddress
   */
  setBaseAddress(/** @type {string} */ baseAddress) {
    this._userDefinedBaseAddress = baseAddress;
  }
  setPhoneNumber(/** @type {string} */ phoneNumber) {
    this.phoneNumber = phoneNumber.trim();
  }
  checkForm() {
    if (!this.phoneNumber) {
      return false;
    }
    if (!util.phone.checkFormat(this.phoneNumber)) {
      return false;
    }
    return true;
  }
  toDto() {
    const { baseAddress, detailAddress, receiverName, zipCode, phoneNumber } =
      this;
    return { baseAddress, detailAddress, receiverName, zipCode, phoneNumber };
  }
}
export class AddressSearchResponse {
  kakaoMap;
  geocoder;
  /** @type {{address_name: string, x: number, y: number}[]} */
  results;
  /** @type  {{address_name: string, x: number, y: number}}*/
  activeResult;
  /** @type {boolean} */
  error;
  /** @type {DeliveryInfo} */
  delivery;
  constructor(kakaoMap, geocoder) {
    this.kakaoMap = kakaoMap;
    this.geocoder = geocoder;
    this.results = [];
    this.activeResult = undefined;
    this.error = false;
    this.delivery = undefined;
  }
  get size() {
    return this.results.length;
  }
  setResults(results) {
    this.results = results.map((place) => {
      place.latLng = new window.kakao.maps.LatLng(
        parseFloat(place.y),
        parseFloat(place.x)
      );
      return place;
    });
    this.setActive(results[0]);
  }
  setError() {
    this.error = true;
    this.results = [];
    this.setActive(undefined);
  }
  setActive(result) {
    this.activeResult = result;
    if (this.activeResult) {
      this.error = false;
      this.kakaoMap.setCenter(result.latLng);
      const level = this.kakaoMap.getLevel();
      if (level > 2) {
        this.kakaoMap.setLevel(2);
      }
    }
  }
  queryAddress() {
    const c = this.kakaoMap.getCenter();
    this.geocoder.coord2Address(c.getLng(), c.getLat(), (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const { address, road_address } = result[0];
        this.delivery = new DeliveryInfo(address, road_address);
      } else {
        console.log("err");
      }
    });
  }
  clearDelivery() {
    this.delivery = undefined;
  }
}

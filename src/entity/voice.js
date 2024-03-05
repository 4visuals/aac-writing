import env from "@/service/env";

/**
 * @property {string} textHash
 */
export class VoiceFile {
  /** @type {number} */
  seq;
  /** @type {string} */
  textHash;
  /** @type {string} 'ncp' or 'local' (case sensitive) */
  origin;
  /** @type {string} {textHash}.mp3 */
  filePath;
  /** @type {number} file size(in bytes) */
  fileSize;
  /** @type {number} 2022 or 2024 */
  voiceVersion;
  /** @type {string} utc time format 'YYYY-MM-DDTHH:mm:ss.tttZ' ending with Z */
  confirmDate;
  /** @type {string} */
  alternativeText;
  /** @type {boolean} */
  spoken;
  /** @type {VoiceFile} 대체 음성*/
  altVoice;
  constructor(dto) {
    Object.assign(this, dto);
    if (!this.confirmDate) {
      this.confirmDate = undefined;
    }
    if (!this.altVoiceRef) {
      this.altVoiceRef = undefined;
    }
    this.alternativeText = undefined;
    this.spoken = false;
    this.altVoice = undefined;
  }
  get updated() {
    return this.alternativeText && this.alternativeText !== this.originText;
  }
  /** @type {string} */
  get text() {
    return this.altVoice
      ? this.altVoice.text
      : this.alternativeText || this.originText;
  }
  getHash(len = 8) {
    len = Math.min(len, this.textHash.length);
    return this.textHash.substring(0, len);
  }
  rollback() {
    this.alternativeText = undefined;
  }
  setAlternativeText(text) {
    this.alternativeText = text;
  }
  setAlternateVoice(altVoice) {
    this.alternativeText = undefined;
    this.altVoiceRef = altVoice.seq;
    this.altVoice = altVoice;
  }
  getLink() {
    return `${env.TTS_POLLY_PATH}/voices3/${this.textHash}.mp3`;
  }
}

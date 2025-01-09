export class DiagnosisQuestion {
  /**
   * @type {{seq: number, question: string, analysis: Array<[number, number]>}}
   */
  dto;
  constructor(dto) {
    this.dto = dto;
  }
  get seq() {
    return this.dto.seq;
  }
  get question() {
    return this.dto.question;
  }
  get analysis() {
    return this.dto.analysis;
  }
}

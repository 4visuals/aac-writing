export class SmsFormType {
  /**
   *
   * @param {string} templateId
   * @param {string} title
   * @param {string} desc
   * @param {import('vue').DefineComponent} component
   */
  constructor(templateId, title, desc, component) {
    this.templateId = templateId;
    this.title = title;
    this.desc = desc;
    this.component = component;
  }
}

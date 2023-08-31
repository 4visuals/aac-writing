export default class NavAction {
  constructor(actionId, actionText, icon, props) {
    this.id = actionId;
    this.text = actionText;
    this.icon = icon;
    this.props = props || {};
  }
}

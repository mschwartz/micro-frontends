(() => {
  class FanTile extends HTMLElement {
    constructor() {
      super();
      this._style = [
        "float: left",
        "width: 128px",
        "height: 128px",
        "border: 2px solid white",
        "border-radius: 8px",
        "text-align: center",
        "padding: 20px",
        "margin: 2px",
      ].join(";");

      this._device = this.innerHTML;
      this._switch_topic = `hubitat/${this._device}/status/switch`;
      this._level_topic = `hubitat/${this._device}/status/level`;
      this._switch = false;
      this._level = 0;
      //
      this.handleSwitchMessage = this.handleSwitchMessage.bind(this);
      this.handleLevelMessage = this.handleLevelMessage.bind(this);
    }

    handleSwitchMessage(e) {
      this._switch = e.detail === "on";
      this.render();
    }
    handleLevelMessage(e) {
      this._level = e.detail;
      this.render();
    }

    render() {
      this.innerHTML = `
    <div style="${this._style}">
	<div>${this._device}</div>
	<div>${this._switch ? "ON" : "OFF"}</div>
	<div>${this._level}</div>
    </div>`;
    }

    connectedCallback() {
      this.render();
      this.addEventListener("click", () => {
        console.log("clicked!");
      });
      document.addEventListener(this._switch_topic, this.handleSwitchMessage);
      document.addEventListener(this._level_topic, this.handleLevelMessage);
      MQTT.subscribe(this._switch_topic);
      MQTT.subscribe(this._level_topic);
    }

    disconnectedCallback() {
      document.removeEventListener(
        this._switch_topic,
        this.handleSwitchMessage
      );
      document.removeEventListener(this._level_topic, this.handleLevelMessage);
      MQTT.unsubscribe(this._level_topic);
      MQTT.unsubscribe(this._switch_topic);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("fan-tile", FanTile);
  });
})();

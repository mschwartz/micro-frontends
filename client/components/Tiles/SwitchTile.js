(() => {
  class SwitchTile extends HTMLElement {
    constructor() {
      super();
      this._style = [
        "float: left",
        "width: 124px",
        "height: 120px",
        "border: 4px outset white",
        "border-radius: 8px",
        "text-align: center",
        "padding: 8px",
        "margin: 2px",
      ].join(";");

      this._device = this.innerHTML;
      this._switch_topic = `hubitat/${this._device}/status/switch`;
      this._switch = false;
      //
      this.handleSwitchMessage = this.handleSwitchMessage.bind(this);
    }

    handleSwitchMessage(e) {
      this._switch = e.detail === "on";
      this.render();
    }

    get template() {
      if (this._switch) {
        return `
	    <div style="${this._style}">
		<div style="color: yellow">
		    <i class="fa fa-lightbulb" style="font-size: 30px; margin-bottom: 8px"></i>
		    <div style="line-height: 120%;  height: 40px">${this._device}</div>
		    <div style="font-size: 20px">ON</div>
		</div>
	    </div>
        `;
      } else {
        return `
	    <div style="${this._style}">
		<i class="fa fa-lightbulb" style="font-size: 30px; margin-bottom: 8px"></i>
		<div style="line-height: 120%;  height: 40px">${this._device}</div>
		<div style="font-size: 20px">OFF</div>
	    </div>
	`;
      }
    }

    render() {
      this.innerHTML = this.template;
    }

    connectedCallback() {
      this.render();
      this.addEventListener("click", (e) => {
        e.stopPropagation();
        console.log("clicked!");
      });
      document.addEventListener(this._switch_topic, this.handleSwitchMessage);
      MQTT.subscribe(this._switch_topic);
    }

    disconnectedCallback() {
      document.removeEventListener(
        this._switch_topic,
        this.handleSwitchMessage
      );
      MQTT.unsubscribe(this._switch_topic);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("switch-tile", SwitchTile);
  });
})();

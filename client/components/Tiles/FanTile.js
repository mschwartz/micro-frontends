(() => {
  class FanTile extends HTMLElement {
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

    template() {
      if (this._switch) {
        let level = "OFF";
        if (this._level < 34) {
          level = "LOW";
        }
        else if (this._level < 67) {
          level = "MEDIUM";
        }
        else {
          level = "HIGH";
        }
        return `
	    <div style="${this._style}">
		<div style="color: yellow">
		    <i style="font-size: 30px; margin-bottom: 8px" class="fas fa-fan"></i>
		    <div style="line-height: 120%;  height: 40px">${this._device}</div>
		    <div style="font-size: 20px">${level}</div>
		</div>
	    </div>
        `;
      } else {
        return `
	    <div style="${this._style}">
	    <i style="font-size: 30px; margin-bottom: 8px" class="fas fa-fan"></i>
	    <div style="line-height: 120%;  height: 40px">${this._device}</div>
	    <div style="font-size: 20px">OFF</div>
	    </div>
	`;
      }
    }

    render() {
      this.innerHTML = this.template();
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

(() => {
  class RingTile extends HTMLElement {
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

      this.device = this.getAttribute("device");
      this.location = this.getAttribute("location");

      this.state = {};

      //
      this.handleMessage = this.handleMessage.bind(this);
    }

    get template() {
      const renderBattery = () => {
        const battery = this.state.battery;
        if (battery === undefined) {
          return "";
        }
        if (battery < 10) {
          return `
<div style="color: red">
<i class="fa fa-battery-empty"></i> ${battery}%
</div>
`;
        }
        else if (battery < 37) {
          return `
<div style="color: orange">
<i class="fa fa-battery-quarter"></i> ${battery}%
</div>
`;
        }
        else if (battery < 63) {
          return `
<div style="color: yellow">
<i class="fa fa-battery-half"></i> ${battery}%
</div>
`;
        }
        else if (battery < 87) {
          return `
<div style="color: green">
<i class="fa fa-battery-three-quarters"></i> ${battery}%
</div>
`;
        }
        else {
          return `
<div style="color: green">
<i class="fa fa-battery-full"></i> ${battery}%
</div>
`;
        }
      };

      return `
<div style="${this._style}">
    <i style="font-size: 30px; margin-bottom: 8px" class="fa fa-dot-circle"></i>
    <div style="height: 40px">${this.device}</div>
    <div style="font-size: 20px">${renderBattery()}</div>
</div>
`;
    }

    render() {
      this.innerHTML = this.template;
    }

    handleMessage(e) {
      const type = e.type.split("/").pop();
      this.state[type] = e.detail;
      this.render();
    }

    connectedCallback() {
      const subscribe = (device) => {
        const topic = `ring/${this.location}/${this.device}/status/${device}`;
        document.addEventListener(topic, this.handleMessage);
        MQTT.subscribe(topic);
      };
      subscribe("motion");
      subscribe("doorbell");
      subscribe("battery");
      this.render();
    }

    disconnectedCallback() {
      const unsubscribe = (device) => {
        const topic = `ring/${this.location}/${this.device}/status/${device}`;
        document.removeEventListener(topic, this.handleMessage);
        MQTT.unsubscribe(topic);
      };
      unsubscribe("motion");
      unsubscribe("doorbell");
      unsubscribe("battery");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("ring-tile", RingTile);
  });
})();

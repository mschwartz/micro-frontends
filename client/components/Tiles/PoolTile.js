(() => {
  class PoolTile extends HTMLElement {
    constructor() {
      super();
      this._style = [
        "float: left",
        "width: 252px",
        "height: 120px",
        "border: 4px outset white",
        "border-radius: 8px",
        "text-align: center",
        // "padding: 20px",
        "margin: 2px",
      ].join(";");

      this.state = {};
      //
      this.handleAutelisMessage = this.handleAutelisMessage.bind(this);
    }

    get template() {
      const {
        pump,
        cleaner,
        poolHeat,
        poolTemp,
        waterfall,
        solarHeat,
        solarTemp,
      } = this.state;
      let colors =
        pump || cleaner || solarHeat
          ? "color: white; background-color: green"
          : "";
      if (poolHeat) {
        colors = "color: white; background-color: red";
      }

      const renderFilter = () => {
        return pump ? `<div style="font-size: 14px; line-height: 18px">Filter ON</div>` : "";
      };
      const renderCleaner = () => {
        return cleaner ? `<div style="font-size: 14px; line-height: 18px">Cleaner ON</div>` : "";
      };
      const renderSolar = () => {
        return solarHeat ? `<div style="font-size: 14px; line-height: 18px">Solar Heat ${solarTemp}&deg;</div>` : "";
      };
      const renderWaterfall = () => {
        return waterfall ? `<div style="font-size: 14px; line-height: 18px">Waterfall ON</div>` : "";
      };
      return `
<div style="${this._style}">
    <div style="padding: 0px; ${colors}; height: 100%">
        <div style="line-height: 36px; font-size: 30px">Pool ${poolTemp}&deg;F</div>
        ${renderFilter()}
        ${renderCleaner()}
        ${renderSolar()}
        ${renderWaterfall()}
    </div>
</div>
`;
    }

    render() {
      this.innerHTML = this.template;
    }

    handleAutelisMessage(e) {
      const backward = window.Config.autelis.deviceMap.backward,
        type = backward[e.type.split("/").pop()],
        value = e.detail;
      switch (value) {
        case "on":
          this.state[type] = true;
          break;
        case "off":
          this.state[type] = false;
          break;
        default:
          this.state[type] = value;
          break;
      }
      this.render();
    }

    connectedCallback() {
      const subscribe = (thing) => {
        const topic = `autelis/status/${thing}`;
        document.addEventListener(topic, this.handleAutelisMessage);
        MQTT.subscribe(topic);
      };

      const forward = window.Config.autelis.deviceMap.forward;

      subscribe(forward.pump);
      subscribe(forward.poolTemp);
      subscribe(forward.cleaner);
      subscribe(forward.waterfall);
      subscribe(forward.poolHeat);
      subscribe(forward.poolSetpoint);
      subscribe(forward.solarHeat);
      subscribe(forward.solarTemp);
      subscribe(forward.poolLight);

      this.render();
    }

    disconnectedCallback() {
      const unsubscribe = (thing) => {
        const topic = `autelis/status/${thing}`;
        document.removeEventListener(topic, this.handleAutelisMessage);
        MQTT.unsubscribe(topic);
      };

      const forward = window.Config.autelis.deviceMap.forward;

      unsubscribe(forward.pump);
      unsubscribe(forward.poolTemp);
      unsubscribe(forward.cleaner);
      unsubscribe(forward.waterfall);
      unsubscribe(forward.poolHeat);
      unsubscribe(forward.poolSetpoint);
      unsubscribe(forward.solarHeat);
      unsubscribe(forward.solarTemp);
      unsubscribe(forward.poolLight);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("pool-tile", PoolTile);
  });
})();

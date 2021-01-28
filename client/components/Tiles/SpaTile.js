(() => {
  class SpaTile extends HTMLElement {
    constructor() {
      super();
      this._style = [
        "float: left",
        "width: 252px",
        "height: 120px",
        "border: 4px outset white",
        "border-radius: 8px",
        "text-align: center",
        "margin: 2px",
      ].join(";");

      this.state = {};
      //
      this.handleAutelisMessage = this.handleAutelisMessage.bind(this);
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

    get template() {
      const { blower, jet, pump, spa, spaHeat, spaSetpoint, spaLight, spaTemp } = this.state;

      const on = spa || spaHeat || jet || blower || spaLight,
            colors = on ? " background-color: red; color: white": "";

      const renderSpa = () => {
        const text = spa ? `Spa ${spaTemp}&deg;F` : "Spa Off";
        return `<div style="font-size: 30px">${text}</div>`;
      };
      const renderHeat = () => {
        return spaHeat ? `<div>Heat ${spaSetpoint}&deg;F</div>` : "";
      };
      const renderJet = () => {
        return jet ? "<div>Jets ON</div>" : "";
      };
      
      const renderBlower = () => {
        return blower ? "<div>Blower ON</div>" : "";
      };
      const renderLight = () => {
        return spaLight ? "<div>Light ON</div>" : "";
      };
      
      return `
<div style="${this._style}">
    <div style="padding: 0px; ${colors}; height: 100%">
      ${renderSpa()}
      ${renderHeat()}
      ${renderJet()}
      ${renderBlower()}
      ${renderLight()}
    </div>
</div>
`;
    }

    render() {
      this.innerHTML = this.template;
    }

    connectedCallback() {
      const subscribe = (thing) => {
        const topic = `autelis/status/${thing}`;
        document.addEventListener(topic, this.handleAutelisMessage);
        MQTT.subscribe(topic);
      };

      const forward = window.Config.autelis.deviceMap.forward;

      subscribe(forward.pump);
      subscribe(forward.spa);
      subscribe(forward.spaTemp);
      subscribe(forward.spaSetPoint);
      subscribe(forward.spaHeat);
      subscribe(forward.jet);
      subscribe(forward.blower);
      subscribe(forward.spaLight);

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
      unsubscribe(forward.spa);
      unsubscribe(forward.spaTemp);
      unsubscribe(forward.spaSetPoint);
      unsubscribe(forward.spaHeat);
      unsubscribe(forward.jet);
      unsubscribe(forward.blower);
      unsubscribe(forward.spaLight);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("spa-tile", SpaTile);
  });
})();

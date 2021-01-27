(() => {
  const getSystemMode = (mode) => {
    const systemModes = [
      /* 0 */ "Cooling",
      /* 1 */ "Heating",
      /* 2 */ "Both",
      /* 3 */ "Emergency",
      /* 4 */ "Off",
      /* 5 */ "Offline",
      /* 6 */ "Auto",
    ];
    if (systemModes[mode] !== undefined) {
      return systemModes[mode];
    }
    return "Offline";
  };

  class ThermostatTile extends HTMLElement {
    constructor() {
      super();
      this._style = [
        "float: left",
        "width: 252px",
        "height: 244px",
        "border: 4px outset white",
        "border-radius: 8px",
        "text-align: center",
        "padding: 20px",
        "margin: 2px",
      ].join(";");
      this.zone = this.getAttribute("zone");

      this.data_topic = `icomfort/zone${this.zone}/status/data`;
      //
      this.handleDataMessage = this.handleDataMessage.bind(this);
    }

    handleDataMessage(e) {
      this.zoneDetail = e.detail.zoneDetail;
      this.render();
    }

    renderSetpoint() {
      const zoneDetail = this.zoneDetail;
      console.log("zoneDetail", zoneDetail);
      switch (zoneDetail.SystemMode) {
      case 0:
        return `<number-input value=${zoneDetail.CoolSetPoint}></number-input>`;
      case 1:
        return `<number-input value=${zoneDetail.HeatSetPoint}></number-input>`;
      case 4:
        return `
<div style="margin-left: 16px" class="btn-toolbar">
    <div class="btn-group btn-group-sm">
	<button class="btn btn-danger">Off</button>
	<button class="btn btn-primary">Cool</button>
	<button class="btn btn-primary">Heat</button>
	<button class="btn btn-primary">Both</button>
    </div>
</div>
`;
        break;
      default:
        return `<number-input></number-input/>`;
      }
    }

    get template() {
      const zoneDetail = this.zoneDetail;
      if (!zoneDetail) {
        return "";
      }

      return `
<div style="${this._style}">
    <div>
	${zoneDetail.Name.toUpperCase()} THERMOSTAT
    </div>
    <div style="font-weight: bold; line-height: 120%; font-size: 80px">
	${zoneDetail.AmbientTemperature}&deg;
    </div>
    <div>
	System is ${getSystemMode(zoneDetail.SystemMode)}
	${this.renderSetpoint()}
    </div>
</div>
`;
    }

    render() {
      console.log("render", this.zoneDetail);
      this.innerHTML = this.template;
    }

    connectedCallback() {
      console.log("subscribe... ", this.data_topic);
      document.addEventListener(this.data_topic, this.handleDataMessage);
      MQTT.subscribe(this.data_topic);
      this.render();
    }

    disconnectedCallback() {}
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("thermostat-tile", ThermostatTile);
  });
})();

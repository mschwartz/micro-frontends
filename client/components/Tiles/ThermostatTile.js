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
      this.handleChange = this.handleChange.bind(this);
    }

    handleDataMessage(e) {
      this.zoneDetail = e.detail.zoneDetail;
      this.render();
    }

    renderSetpoint() {
      const zoneDetail = this.zoneDetail;
      switch (zoneDetail.SystemMode) {

        case 0:
          return `<number-input id="thermostat-number-input" value=${zoneDetail.CoolSetPoint}></number-input>`;

        case 1:
          return `<number-input id="thermostat-number-input" value=${zoneDetail.HeatSetPoint}></number-input>`;

        case 4:
          return `
<div style="margin-top: 20px; margin-left: 16px" class="btn-toolbar">
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

      let color = "",
        temp = "";

      switch (zoneDetail.SystemMode) {

        case 0:
          color = `color: blue`;
          if (zoneDetail.Cooling) {
            temp = "color: blue";
          }
          break;

        case 1:
          color = `color: orange`;
          if (zoneDetail.Heating) {
            temp = "color: orange";
          }
          break;
      }

      return `
<div style="${this._style}">
    <div style="${color}">
	${zoneDetail.Name.toUpperCase()}
    </div>
    <div style="font-weight: bold; line-height: 120%; font-size: 80px; ${temp}">
	${zoneDetail.AmbientTemperature}&deg;
    </div>
    <div>
	<div style="margin-bottom: 20px; ${color}">
	    System is ${getSystemMode(zoneDetail.SystemMode)}
	</div>
	${this.renderSetpoint()}
    </div>
</div>
`;
    }

    handleChange(e) {
      if (!this.zoneDetail) {
        return;
      }

      const temp = e.detail,
        zoneDetail = this.zoneDetail,
        heat = zoneDetail.HeatSetPoint,
        cool = zoneDetail.CoolSetPoint;

      switch (zoneDetail.SystemMode) {
        case 0:
          MQTT.publish(
            `icomfort/zone${this.zone}/set/setpoint`,
            `${temp}:${cool}`
          );
          break;
        case 1:
          MQTT.publish(
            `icomfort/zone${this.zone}/set/setpoint`,
            `${heat}:${temp}`
          );
          break;
        default:
          break;
      }
    }

    render() {
      const old = document.getElementById("thermostat-number-input");
      if (old) {
        old.removeEventListener("change", this.handleChange);
      }
      this.innerHTML = this.template;
      const input = document.getElementById("thermostat-number-input");
      if (input) {
        input.addEventListener("change", this.handleChange);
      }
    }

    connectedCallback() {
      document.addEventListener(this.data_topic, this.handleDataMessage);
      MQTT.subscribe(this.data_topic);
      this.render();
    }

    disconnectedCallback() {
      const old = document.getElementById("thermostat-number-input");
      if (old) {
        old.removeEventListener("change", this.handleChange);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("thermostat-tile", ThermostatTile);
  });
})();

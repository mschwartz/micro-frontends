(() => {
  class WeatherTile extends HTMLElement {
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

      this.location = this.getAttribute("location");
      this.weather_topic = `weather/${this.location}/status/observation`;
      //
      this.handleWeatherMessage = this.handleWeatherMessage.bind(this);
    }

    handleWeatherMessage(e) {
      this._now = e.detail;
      this.render();
    }

    get template() {
      const now = this._now;
      if (!now) {
        console.log("not now");
        return "";
      }
      return `
<div style="${this._style}">
    <div style="text-align: "center"; margin-right: 10px; margin-top: 20px"" >
	<div>${now.city}</div>
	<div>${now.description}</div>
	<div style="font-size: 32px; height: 72px" >
	    <img
		alt="${now.iconName}"
		style="vertical-align: bottom; width: 80px; height: 80px"
		src="${now.iconLink}"
	    />
	    <div style="display: inline">
		<span style="font-size: 44px" >
		    <locale-temperature value=${now.temperature} />
		</span>
	    </div>
	</div>
	<div style="text-align: right">
	    <locale-temperature value=${now.highTemperature} > </locale-temperature>
	    / 
	    <locale-temperature value="${now.lowTemperature}"></locale-temperature>
	</div>
	<div style="font-size: 24px; margin-top: 5px; marginBottom: 6px; text-align: center" >
	    <i class="fa fa-flag style="font-size: 32px"></i> ${now.windDescShort}
	    <locale-speed value=${now.windSpeed} ></locale-speed/>
	</div>
    </div>
</div>
`;
    }

    render() {
      this.innerHTML = this.template;
    }

    connectedCallback() {
      console.log("SUBSCRIBE", this.weather_topic);
      document.addEventListener(this.weather_topic, this.handleWeatherMessage);
      MQTT.subscribe(this.weather_topic);
      this.render();
    }

    disconnectedCallback() {
      document.removeEventListener(
        this.weather_topic,
        this.handleWeatherMessage
      );
      MQTT.unsubscribe(this.weather_topic);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("weather-tile", WeatherTile);
  });
})();

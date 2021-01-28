(() => {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  class ClockTile extends HTMLElement {
    constructor() {
      super();
      this._interval = null;
      this._date = new Date();
      this._style = [
        "float: left",
        "width: 252px",
        "height: 244px",
        "border: 4px outset white",
        "border-radius: 8px",
        "text-align: center",
        "padding: 8px",
        "margin: 2px",
      ].join(";");

      const location = this.getAttribute("location");
      this.weather_topic = `weather/${location}/status/astronomy`;
      this.handleWeatherMessage = this.handleWeatherMessage.bind(this);
    }

    get template() {
      const date = this._date;
      return `
<div style="${this._style}">
    <div style="margin-top: 20px; font-size: 20px">
	${dayNames[date.getDay()]} ${date.toLocaleDateString()}
    </div>
    <div style="font-size: 64px; font-weight: bold">
	<locale-time 
	ampm=${false} 
	seconds=small
	value=${this._date.getTime()}
	>
	</locale-time>
    </div>
    <div>
Sunrise: ${this._sunrise}
    </div>
    <div>
Sunset: ${this._sunset}
    </div>
</div>
`;
    }

    handleWeatherMessage(e) {
      this._sunrise = new Date(e.detail.sunrise * 1000)
        .toLocaleTimeString()
        .replace(":00 ", " ");
      this._sunset = new Date(e.detail.sunset * 1000)
        .toLocaleTimeString()
        .replace(":00 ", " ");
    }

    render() {
      this.innerHTML = this.template;
    }

    connectedCallback() {
      if (!this.interval) {
        this.interval = setInterval(() => {
          this._date = new Date();
          this.render();
        }, 1000);
      }
      document.addEventListener(this.weather_topic, this.handleWeatherMessage);
      MQTT.subscribe(this.weather_topic);

      this.render();
    }

    disconnectedCallback() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
      document.removeEventListener(
        this.weather_topic,
        this.handleWeatherMessage
      );
      MQTT.unsubscribe(this.weather_topic);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("clock-tile", ClockTile);
  });
})();

(() => {
  class TheaterTile extends HTMLElement {
    constructor() {
      super();

      this.title = this.getAttribute("title");
      console.log("theater", this.title);
      this._style = [
        "float: left",
        "width: 252px",
        "height: 244px",
        "border: 4px outset white",
        "border-radius: 8px",
        "text-align: center",
        "padding: 2px",
        "margin: 2px",
      ].join(";");

      this.theater = new Theater(this.title);
      this.state = {
        show: false,
      };

      //
      this.handleChange = this.handleChange.bind(this);
    }

    formatTime(time) {
      const hours = parseInt(time / 3600, 10);
      const minutes = parseInt((time % 3600) / 60, 10);
      const seconds = parseInt(time % 60, 10);
      return `${hours ? hours + ":" : ""}${
        minutes < 10 ? "0" + minutes : minutes
      }:${seconds < 10 ? "0" + seconds : seconds}`;
    }

    renderTiVo() {
      try {
        const { currentDevice, channels, channel } = this.state,
          guide = channels[channel];

        // console.log("tivo", currentDevice);
        if (currentDevice.type !== "tivo") {
          return "";
        }

        // console.log("render tivo", this.state.tivo);
        // console.log("render tivo favorites", JSON.stringify(this.state.tivo.favorites));
        return `
	    <tivo-tile
		title="${this.state.tivo.title}"
		channels='${JSON.stringify(channels)}'
		favorites='${JSON.stringify(this.state.tivo.favorites)}'
		device="${this.state.tivo.device}"
		guide="${this.state.tivo.guide}"
		logo="${guide.logo.URL}"
		channel="${channel}"
		name="${guide.name}"
	    >
	    </tivo-tile>
        `;
      } catch (e) {
        return "";
      }
    }

    renderAppleTV() {
      try {
        const currentDevice = this.state.currentDevice;
        if (!currentDevice || currentDevice.type !== "appletv") {
          return "";
        }
        const { appletv, info } = this.state;
        if (!info) {
          console.log("no info");
          return "";
        }
        return `
	<appletv-tile
	    title="${info.title}"
	    album="${info.album}"
	    device-state="${info.deviceState}"
	    position="${info.position}"
	    total-time="${info.total_time}"
	    name="${appletv.name}"
	    device="${appletv.device}"
        >
	</appletv-tile/>
`;
      } catch (e) {
        return "";
      }
    }

    get template() {
      const avr = this.state.avr;
      if (!avr) {
        return "";
      }
      // console.log("avr", avr.mute);

      return `
	<div style="${this._style}">
	<div style="height: 190px">
	    ${this.renderTiVo()}
	    ${this.renderAppleTV()}
	</div>
	    <denon-tile
		power="${avr.power}"
		device="${avr.device}"
		mute="${avr.mute ? "true" : "false"}"
	    >
	    </denon-tile>
	</div>
`;
    }

    render() {
      // console.log("render", this.state);
      this.innerHTML = this.template;
    }

    handleChange(e) {
      this.state = e.detail;
      this.render();
    }

    connectedCallback() {
      document.addEventListener(this.theater.eventType, this.handleChange);
      this.theater.subscribe();
      this.render();
    }

    disconnectedCallback() {
      this.theater.unsubscribe();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("theater-tile", TheaterTile);
  });
})();

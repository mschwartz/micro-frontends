(() => {
  class AppleTVTile extends HTMLElement {
    constructor() {
      super();

      this.title = this.getAttribute("title");
    }

    formatTime(time) {
      const hours = parseInt(time / 3600, 10);
      const minutes = parseInt((time % 3600) / 60, 10);
      const seconds = parseInt(time % 60, 10);
      return `${hours ? hours + ":" : ""}${
        minutes < 10 ? "0" + minutes : minutes
      }:${seconds < 10 ? "0" + seconds : seconds}`;
    }

    renderControls() {
      const device = this.getAttribute("device"),
        topic = `appletv/${device}/set/command`;

      return `
	<div class="btn-group">
	    <mqtt-button 
		mini 
		variant="secondary"
		topic="${topic}"
		message="Suspend"
	    >
		<i class="fa fa-tv"></i>
	    </mqtt-button>
	    <mqtt-button 
		mini 
		topic="${topic}"
		message="Up"
	    >
		<i class="fa fa-chevron-up"></i>
	    </mqtt-button>
	    <mqtt-button 
		mini 
		variant="secondary"
		topic="${topic}"
		message="Menu"
	    >
		<i class="fa fa-caret-square-up"></i>
	    </mqtt-button>
	</div>

	<div class="btn-group">
	    <mqtt-button 
		mini 
		topic="${topic}"
		message="Left"
	    >
		<i class="fa fa-chevron-left"></i>
	    </mqtt-button>
	    <mqtt-button 
		mini 
		variant="secondary" 
		topic="${topic}"
		message="Select"
	    >
		<i class="fa fa-chevron-left"></i>
	    </mqtt-button>
	    <mqtt-button 
		mini 
		topic="${topic}"
		message="Right"
	    >
		<i class="fa fa-chevron-right"></i>
	    </mqtt-button>
	</div>
	<div class="btn-group">
	    <mqtt-button mini variant="none"></mqtt-button>
	    <mqtt-button 
		mini 
		topic="${topic}"
		message="Down"
	    >
		<i class="fa fa-chevron-down"></i>
	    </mqtt-button>
	    <mqtt-button mini variant="none"></mqtt-button>
	</div>
`;
    }

    renderPlaybackState() {
      try {
        const deviceState = this.getAttribute("device-state"),
          title = this.getAttribute("title"),
          position = this.getAttribute("position"),
          total_time = this.getAttribute("total-time");

        if (deviceState === "Playing" || deviceState === "Paused") {
          return `
		${this.renderTitle(title)}
		<div style="font-size: 10px; margin-top: -2px; margin-bottom: 4px" >
		    ${deviceState}
		</div>


		<div
		    style="
			font-size: 14px;
			float: left;
			width: 20%;
			margin-top: -2px;
			margin-right: 10px;
			text-align: right;
		    "
		>
		    ${this.formatTime(position)}
		</div>

		<div class="progress" style="float: left; width: 50%" >
		    <div style="width: 50%" class="progress-bar bg-success"/>
		</div>
	    </div>

	    <div
	    style="
		margin-left: -16px;
		font-size: 14px;
		float: left;
		width: 20%;
		margin-top: -3px;
		margin-left: 10px;
		text-align: left;
	    "
	    >
		-${this.formatTime(total_time - position)}
	    </div>
	    <div class="clearfix"></div>
          `;
        }
        // if (!info.playbackState) {
      } catch (e) {
        console.log("E", e);
      }

      const device = this.getAttribute("device");
      return `
        <div>
          <div style={{ fontSize: 18, fontWeight: "bold" }}>${device}</div>
          <div style={{ fontSize: 16 }}>Not Playing</div>
        </div>
      `;
    }

    renderTitle() {
      const title = this.getAttribute("title"),
        album = this.getAttribute("album");

      const formatted_title = album ? `${title} ${album}` : title;
      if (title.length > 34) {
        return `
          <marquee
            scrolldelay="200"
            behavior="alternate"
            style="font-weight: bold; font-size: 14px""
          >
            ${formatted_title}
          </marquee>
        `;
      } else {
        return `
	    <div style="font-weight: bold; font-size: 14px">${formatted_title}</div>
        `;
      }
    }

    get template() {
      try {
        const device = this.getAttribute("device");
        
        return `
	    <div>
		${this.renderPlaybackState()}
	    </div>
	    <div style="margin-top: 6px">
		${this.renderControls()}
	    </div>
	    <appletv-transport device=${device}></appletv-transport>
        `;
      } catch (e) {
        console.log(e);
        return "";
      }
    }

    render() {
      // console.log("appletv render", this);
      this.innerHTML = this.template;
    }

    connectedCallback() {
      this.render();
    }

    disconnectedCallback() {}
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("appletv-tile", AppleTVTile);
  });
})();

(() => {
  class DenonTile extends HTMLElement {
    constructor() {
      super();
    }

    get template() {
      const power = this.getAttribute("power"),
        device = this.getAttribute("device"),
        mute = this.getAttribute("mute") === "true";

      if (!power) {
        return "AVR OFF";
      }

      // console.log("mute", mute, typeof mute);

      const topic = `denon/${device}/set/command`,
        message = mute ? "MUOFF" : "MUON",
        mvariant = mute ? "danger" : "primary";

      // console.log("mvariant", mute, mvariant, message);
      return `
	<div class="btn-group">
	    <mqtt-button
		mini
		variant="${mvariant}"
		topic="${topic}"
		message="${message}"
	    >
		<i class="fa fa-volume-mute"></i>
	    </mqtt-button>
	    <mqtt-button
		mini
		variant="primary"
		topic="${topic}"
		message="MVDOWN"
	    >
		<i class="fa fa-volume-down"></i>
	    </mqtt-button>
	    <mqtt-button
		mini
		variant="primary"
		topic="${topic}"
		message="MVUP"
	    >
		<i class="fa fa-volume-up"></i>
	    </mqtt-button>
	    <mqtt-button
		mini
		variant="primary"
		topic="${topic}"
		message="MSMOVIE"
	    >
		DD
	    </mqtt-button>
	    <mqtt-button
		mini
		variant="primary"
		topic="${topic}"
		message="CVC 62"
	    >
		<i class="fa fa-comment-alt"></i>
	    </mqtt-button>
	</div>
`;
    }

    render() {
      this.innerHTML = this.template;
    }

    connectedCallback() {
      this.render();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("denon-tile", DenonTile);
  });
})();

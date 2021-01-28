(() => {
  class AppleTVTransport extends HTMLElement {
    constructor() {
      super();
    }

    get template() {
      const device = this.getAttribute("device"),
            topic = `appletv/${device}/set/command`;

      return `
	<div role="group" class="fixed-bottom btn-group" style="padding: 0px; margin: 0px; width: 1024px;">
	    <mqtt-button 
		style="flex-grow: 1" 
		variant="primary" 
		topic="${topic}"
		message="BeginRewind"
		transport
	    >
		<i class="fa fa-backward"></i>
	    </mqtt-button>
	    <mqtt-button 
		style="flex-grow: 1" 
		variant="primary" 
		topic="${topic}"
		message="Pause"
		transport
	    >
		<i class="fa fa-pause"></i>
	    </mqtt-button>
	    <mqtt-button 
		style="flex-grow: 1" 
		variant="primary" 
		topic="${topic}"
		message="Play"
		transport
	    >
		<i class="fa fa-play"></i>
	    </mqtt-button>
	    <mqtt-button 
		style="flex-grow: 1" 
		variant="primary" 
		topic="${topic}"
		message="BeginForward"
		transport
	    >
		<i class="fa fa-forward"></i>
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
    customElements.define("appletv-transport", AppleTVTransport);
  });
})();

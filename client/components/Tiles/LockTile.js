(() => {
  class LockTile extends HTMLElement {
    constructor() {
      super();
      this._style = [
        "float: left",
        "width: 124px",
        "height: 120px",
        "border: 4px outset white",
        "border-radius: 8px",
        "text-align: center",
        "padding: 8px",
        "margin: 2px",
      ].join(";");
      this.hub = this.getAttribute("hub");
      this.device = this.getAttribute("device");
      this.title = this.getAttribute("title");

      this.state = {};
      //
      this.handleLockMessage = this.handleLockMessage.bind(this);
    }

    handleLockMessage(e) {
      this.state.lock = e.detail.toUpperCase();
      this.render();
    }

    get template() {
      if (this.state.lock === "LOCKED") {
        return `
<div style="${this._style}">
    <div style="color: green">
	<i style="font-size: 30px; margin-bottom: 8px" class="fa fa-lock"></i>
	<div style="height: 40px">${this.title}</div>
	<div style="font-size: 20px">LOCKED</div>
    </div>
</div>
	`;
      } else {
        return `
<div style="${this._style}">
    <div style="color: red">
	<i style="font-size: 30px; margin-bottom: 8px" class="fa fa-lock-open"></i>
	<div style="height: 40px">${this.title}</div>
	<div style="font-size: 20px">UNLOCKED</div>
    </div>
</div>
	`;
      }
    }

    render() {
      this.innerHTML = this.template;
    }

    connectedCallback() {
      const topic = `${this.hub}/${this.device}/status/lock`;
      document.addEventListener(topic, this.handleLockMessage);
      MQTT.subscribe(topic);
      this.render();
    }

    disconnectedCallback() {
      const topic = `${this.hub}/${this.device}/status/lock`;
      document.removeEventListener(topic, this.handleLockMessage);
      MQTT.unsubscribe(topic);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("lock-tile", LockTile);
  });
})();

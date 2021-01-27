(() => {
  window.next_id = 1;
  const CONFIG_TOPIC = "settings/status/config";

  class ConfigMarker extends HTMLElement {
    constructor() {
      super();
      this.child_elements = this.innerHTML;
      this.handleMessage = this.handleMessage.bind(this);
    }

    render() {
      const height = 768 - 54 - 1;
      this.innerHTML = `${this.child_elements}`;
    }

    handleMessage(event) {
      console.log("message");
      window.Config = event.detail;
      console.log("GOT CONFIG", window.Config);
      this.render();
    }
    connectedCallback() {
      document.addEventListener(CONFIG_TOPIC, this.handleMessage);
      MQTT.subscribe(CONFIG_TOPIC);
      // this.render();
      // this.addEventListener("click", () => {
      //   console.log("clicked!");
      // });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("config-marker", ConfigMarker);
  });
})();

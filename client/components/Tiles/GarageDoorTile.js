(() => {
  class GarageDoorTile extends HTMLElement {
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

      this.device = this.getAttribute("device");
      this.title = this.getAttribute("title");
      this.door = this.title;

      this.state = {};

      //
      this.handleDoorMessage = this.handleDoorMessage.bind(this);
    }

    get template() {
      if (!this.state.door) {
        return "";
      }
      const door = this.state.door.toUpperCase();
      const color = door === "CLOSED" ? "color: green" : "color: red";
      
      return `
<div style="${this._style}">
<div style="${color}">
    <i style="font-size: 30px; margin-bottom: 8px;" class="fa fa-download"></i>
    <div style="height: 40px"> ${this.title}</div>
    <div style="font-size: 20px">${door}</div>
</div>
</div>
`;
    }

    render() {
      this.innerHTML = this.template;
    }

    handleDoorMessage(e) {
      this.state.door = e.detail;
      this.render();
    }

    connectedCallback() {
      const subscribe = (door) => {
        const topic = `myq/${door}/status/door_state`;
        document.addEventListener(topic, this.handleDoorMessage);
        MQTT.subscribe(topic);
      };
      subscribe(this.door);
      this.render();
    }

    disconnectedCallback() {
      const unsubscribe = (door) => {
        const topic = `myq/${door}/status/door_state`;
        document.removeEventListener(topic, this.handleDoorMessage);
        MQTT.unsubscribe(topic);
      };
      unsubscribe(this.door);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("garagedoor-tile", GarageDoorTile);
  });
})();

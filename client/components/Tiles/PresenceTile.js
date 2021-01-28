(() => {
  class PresenceTile extends HTMLElement {
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
      this.people = JSON.parse(this.getAttribute("people"));

      this.state = {};
      //
      this.handlePresenceMessage = this.handlePresenceMessage.bind(this);
    }

    handlePresenceMessage(e) {
      const parts = e.type.split("/"),
        type = parts[1];
      this.state[type] = e.detail;
      this.render();
    }

    get template() {
      let color = "color: red",
        html = "";
      for (const key of Object.keys(this.state)) {
        if (this.state[key]) {
          color = "color: green";
          html += `<div style="font-size: 16px; color: green"><i style="margin-right: 10px;" class="fa fa-user-plus"></i>${key}</div>`;
        } else {
          html += `<div style="font-size: 16px; color: red"><i style="margin-right: 10px;" class="fa fa-user-minus"></i/>${key}</div>`;
        }
      }

      return `
<div style="${this._style}">
    <i style="${color}; font-size: 30px; margin-bottom: 8px; "class="fa fa-house-user"></i>
    <div>${html}</div>
</div>
`;
    }

    render() {
      this.innerHTML = this.template;
    }

    connectedCallback() {
      const subscribe = (person, device) => {
        const topic = `presence/${person.name}/status/${device}`;
        document.addEventListener(topic, this.handlePresenceMessage);
        MQTT.subscribe(topic);
      };

      const people = this.people;
      for (const person of people) {
        for (const device of person.devices) {
          subscribe(person, device);
        }
      }
      this.render();
    }

    disconnectedCallback() {
      const unsubscribe = (person, device) => {
        const topic = `presence/${person.name}/status/${device}`;
        document.removeEventListener(topic, this.handlePresenceMessage);
        MQTT.unsubscribe(topic);
      };

      const people = this.people;
      for (const person of people) {
        for (const device of person.devices) {
          unsubscribe(person, device);
        }
      }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("presence-tile", PresenceTile);
  });
})();

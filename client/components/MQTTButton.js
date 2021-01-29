(() => {
  class MQTTButton extends HTMLElement {
    constructor() {
      super();
      this._child_elements = this.innerHTML;

      this.clickHandler = this.clickHandler.bind(this);
    }

    get template() {
      const mini = this.getAttribute("mini"),
        transport = this.getAttribute("transport"),
        variant = this.getAttribute("variant");

      const styles = [
        "height: 40px",
        "font-size: 14px",
        "padding-bottom: 22px",
        "margin-right: 1px",
      ];
      let cls = [];
      try {
        switch (variant) {
          case "primary":
          case "secondary":
          case "success":
          case "danger":
          case "warning":
          case "info":
          case "light":
          case "dark":
            cls.push("btn-" + variant);
            break;
          default:
            cls.push("btn-primary");
            break;
        }
      } catch (e) {
        console.log("ee", e);
      }

      // console.log("transport", transport, typeof transport);
      if (mini !== null && mini !== "false") {
        if (transport === null) {
          styles.push("width: 46px");
          styles.push("max-width: 46px");
          styles.push("min-width: 46px");
        } else {
          // styles.push("flex-grow: 1");
          // styles.push("flex-shrink: 1");
          cls.push("btn-block");
        }
      } else {
        if (transport === null) {
          styles.push("width: 100px");
          styles.push("max-width: 100px");
          styles.push("min-width: 100px");
        } else {
          cls.push("btn-block");
          // styles.push("flex-grow: 1");
          // styles.push("flex-shrink: 1");
        }
      }

      if (variant === "none") {
        return `<div style="${styles.join("; ")}"></div>`;
      } else {
        return `
	<button type="button" class="btn ${cls.join(" ")}" style="${styles.join("; ")}">
	    ${this._child_elements}
	</button>
`;
      }
    }

    render() {
      this.innerHTML = this.template;
    }

    clickHandler(e) {
        const topic = this.getAttribute("topic"),
          message = this.getAttribute("message");

        e.stopPropagation();
        console.log("click", topic, message);
        if (!message || !topic) {
          console.log("Error!");
        } else {
          MQTT.publish(topic, message);
        }
    }
    connectedCallback() {
      this.render();
      this.addEventListener("click", this.clickHandler);
    }

    disconnectedCallback() {
      this.removeEventListener("click", this.clickHandler);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("mqtt-button", MQTTButton);
  });
})();

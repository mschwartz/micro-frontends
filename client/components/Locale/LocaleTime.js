(() => {
  class LocaleTime extends HTMLElement {
    constructor() {
      super();
    }

    get template() {
      const value = Number(this.getAttribute("value")),
        ampm = this.getAttribute("ampm") === "true",
        military = this.getAttribute("military") === "true",
        seconds = this.getAttribute("seconds"),
        d = new Date(value);
      let s = d.toLocaleTimeString();

      if (!ampm) {
        s = s.replace(" PM", "").replace(" AM", "");
      }
      if (seconds === "small") {
        const parts = s.split(':');
        const html = `
<span>${parts[0]}:${parts[1]}</span><span style="font-weight: normal; font-size: smaller">${parts[2]}</span/>
`;
        return html;
      }
      return ` ${s} `;
    }

    render() {
      this.innerHTML = this.template;
    }

    connectedCallback() {
      this.render();
    }

    disconnectedCallback() {}
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("locale-time", LocaleTime);
  });
})();

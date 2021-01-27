(() => {
  class LocaleTemperature extends HTMLElement {
    constructor() {
      super();

    }

    get template() {
      const value = this.getAttribute("value");

      console.log("value", value);
      return `<span>${value}&deg;F</span>`;
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
    customElements.define("locale-temperature", LocaleTemperature);
  });
})();

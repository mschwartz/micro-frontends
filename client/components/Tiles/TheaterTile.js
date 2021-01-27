(() => {
  class TheaterTile extends HTMLElement {
    constructor() {
      super();
      this._style = [
        "float: left",
        "width: 252px",
        "height: 244px",
        "border: 4px outset white",
        "border-radius: 8px",
        "text-align: center",
        "padding: 20px",
        "margin: 2px",
      ].join(";");
    }

    get template() {
      return `
<div style="${this._style}">
THEATER
</div>
`;
    }

    render() {
      this.innerHTML = this.template;
    }

    connectedCallback() {
      this.render();
    }

    disconnectedCallback() {
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("theater-tile", TheaterTile);
  });
})();

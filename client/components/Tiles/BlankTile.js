(() => {
  class BlankTile extends HTMLElement {
    constructor() {
      super();
      this._style = [
        "float: left",
        "width: 128px",
        "height: 128px",
      ].join(";");
    }

    get template() {
      return `
<div style="${this._style}">
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
    customElements.define("blank-tile", BlankTile);
  });
})();

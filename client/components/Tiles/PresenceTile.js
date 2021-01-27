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
    }

    get template() {
      return `
<div style="${this._style}">
    <i style="font-size: 24px; "class="fa fa-house-user"></i>
    <div> Presence </div>
</div>
`;
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
    customElements.define("presence-tile", PresenceTile);
  });
})();

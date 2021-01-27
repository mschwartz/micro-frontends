(() => {
  class MacroTile extends HTMLElement {
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

      this._device = this.innerHTML;
      this._switch = false;
      this._level = 0;
      //
      this.handleMacroMessage = this.handleMacroMessage.bind(this);
    }

    handleMacroMessage(e) {
      this._switch = e.detail === "on";
      this.render();
    }

    get template() {
      return `
	    <div style="${this._style}">
		<i class="fa fa-play" style="font-size: 24px"></i>
		<div style="height: 44px">${this._device}</div>
		<div>Macro</div>
	    </div>
        `;
    }

    render() {
      this.innerHTML = this.template;
    }

    connectedCallback() {
      this.render();
      this.addEventListener("click", () => {
        console.log("clicked!");
      });
    }

    disconnectedCallback() {}
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("macro-tile", MacroTile);
  });
})();

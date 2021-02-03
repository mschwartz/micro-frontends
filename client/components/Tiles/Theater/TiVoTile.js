(() => {
  class TiVoTile extends HTMLElement {
    constructor() {
      super();
      this.state = { show: false };
      //
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
      e.stopPropagation();
      this.state.show = true;
      this.render();
    }

    get template() {
      const title = this.getAttribute("title"),
        guide = this.getAttribute("guide"),
        device = this.getAttribute("device"),
        logo = this.getAttribute("logo"),
        channel = this.getAttribute("channel"),
        name = this.getAttribute("name");

      const renderGuide = () => {
        return `
	  <img src=${logo} alt=${name} style="width: 128px; margin 0px; padding: 0px"/>
        `;
      };

      return `
	<tivo-favorites 
	    show=${this.state.show}
            guide=${guide}
            device=${device}
	>
	</tivo-favorites>
	<div id="tivo-favorites-show">
	    <h4>${title}</h4>
	    ${renderGuide()}
	    <div>
		${channel} ${name}
	    </div>
	</div>
      `;
    }

    hide() {
      this.state.show = false;
      this.render();
    }

    show() {
      this.state.show = true;
      this.render();
    }

    render() {
      try {
        document
          .getElementById("tivo-favorites-show")
          .removeEventListener("click", this.handleClick);
      } catch (e) {
        // we don't care if the remove failed
      }
      this.innerHTML = this.template;
      document
        .getElementById("tivo-favorites-show")
        .addEventListener("click", this.handleClick);
    }

    connectedCallback() {
      this.render();
    }

    disconnectedCallback() {}
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("tivo-tile", TiVoTile);
  });
})();

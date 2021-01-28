(() => {
  class ClientArea extends HTMLElement {
    constructor() {
      super();
      this.child_elements = this.innerHTML;
    }

    render() {
      console.log(`Render client area hash(${window.location.hash})`);
      const height = 768 - 54 - 1;
      this.innerHTML = `
	    <div style="width: 1024px; height: ${height}px; max-height: ${height}px">
		${this.child_elements}
	    </div>
	`;
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        this.render();
      }
    }

    connectedCallback() {
      this.render();
      // this.addEventListener("click", () => {
      //   console.log("clicked!");
      // });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("client-area", ClientArea);
  });
})();

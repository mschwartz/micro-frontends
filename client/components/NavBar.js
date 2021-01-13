class NavBar extends HTMLElement {
  constructor() {
    super();
    this.child_elements = this.innerHTML;
    this.element_style = {
      backgroundColor: "darkgrey",
      color: "white",
    };
  }

  render() {
    this.innerHTML = `
      <nav 
	style="${objectToCSS(this.element_style)}"
	class="navbar navbar-expand-lg navbar-dark bg-dark"
      >
        ${this.child_elements}
      </nav>
`;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    this.addEventListener("click", () => {
      console.log("clicked!");
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  customElements.define("nav-bar", NavBar);
});

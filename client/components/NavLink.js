class NavLink extends HTMLElement {
  constructor() {
    super();
    this.child_elements = this.innerHTML;
  }

  render() {
    this.innerHTML = `<button>${this.child_elements}</button>`;
  }

  connectedCallback() {
    this.render();
    this.addEventListener("click", () => {
      console.log("clicked!");
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  customElements.define("nav-link", NavLink);
});

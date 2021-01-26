(() => {
  class NavLink extends HTMLElement {
    constructor() {
      super();
      this.child_elements = this.innerHTML;
    }

    render() {
      this.innerHTML = `<li class="nav-item"><a class="nav-link">${this.child_elements}</a/></li>`;
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
})();

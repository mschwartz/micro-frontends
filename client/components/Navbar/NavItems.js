(() => {
  class NavItems extends HTMLElement {
    constructor() {
      super();
      this.child_elements = this.innerHTML;
    }

    render() {
      console.log("render");
      this.innerHTML = `<ul class="navbar-nav">${this.child_elements}</ul>`;
    }

    connectedCallback() {
      this.render();
      this.addEventListener("click", () => {
        console.log("clicked!");
        // document.location.reload();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("nav-items", NavItems);
  });
})();

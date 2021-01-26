(() => {
  class NavText extends HTMLElement {
    constructor() {
      super();
      this.child_elements = this.innerHTML;
    }

    render() {
      this.innerHTML = `<a class="navbar-brand" href="#">${this.innerHTML}</a>`;
    }

    connectedCallback() {
      this.render();
      this.addEventListener("click", () => {
        console.log("clicked!");
        document.location.reload();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("nav-text", NavText);
  });
})();

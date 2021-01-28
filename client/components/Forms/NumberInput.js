(() => {
  const WAIT = 750; // how long to wait for additional input

  class NumberInput extends HTMLElement {
    constructor() {
      super();
      this._style = ["margin: 8px"].join(";");
      this.delayedTask = null;
      //
      this.left_button_id = "btn-" + ++window.next_id;
      this.input_id = "input-" + ++window.next_id;
      this.right_button_id = "btn-" + ++window.next_id;
      //
      //
      this.decrementTemperature = this.decrementTemperature.bind(this);
      this.incrementTemperature = this.incrementTemperature.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
      console.log("change", e);
    }

    get template() {
      const value = this.getAttribute("value");

      return `
<div style="${this._style}">
    <button 
	id=${this.left_button_id} 
	class="btn btn-lg btn-primary"
    >
	<i class="fa fa-chevron-left"></i>
    </button>
    <input id=${this.input_id} disabled type="text" style="text-align: center; height: 40px; width: 40px" value=${value}>
    <button id=${this.right_button_id} class="btn btn-lg btn-primary"><i class="fa fa-chevron-right"></i></button>
</div>
`;
    }

    render() {
      this.innerHTML = this.template;
    }

    decrementTemperature(e) {
      // e.preventDefault();
      e.stopPropagation();
      const value = Number(this.input.value) - 1;

      this.input.value = value;
      if (!this.delayedTask) {
        this.delayedTask = new DelayedTask(() => {
          this.dispatchEvent(
            new CustomEvent("change", { detail: this.input.value })
          );
          this.delayedTask = null;
        }, WAIT);
      } else {
        this.delayedTask.defer(WAIT);
      }
    }

    incrementTemperature(e) {
      // e.preventDefault();
      e.stopPropagation();
      const value = Number(this.input.value) + 1;

      this.input.value = value;
      if (!this.delayedTask) {
        this.delayedTask = new DelayedTask(() => {
          this.dispatchEvent(
            new CustomEvent("change", { detail: this.input.value })
          );
          this.delayedTask = null;
        }, 500);
      } else {
        this.delayedTask.defer(500);
      }
    }

    connectedCallback() {
      this.render();
      this.left = document.getElementById(`${this.left_button_id}`);
      this.right = document.getElementById(`${this.right_button_id}`);
      this.input = document.getElementById(`${this.input_id}`);

      // console.log("left", this.left_button_id, this.left);
      // console.log("right", this.right_button_id, this.right);
      this.right.addEventListener("click", this.incrementTemperature);
      this.left.addEventListener("click", this.decrementTemperature);
      // this.input.addEventListener("change", this.handleChange);
      // document.getElementById(`#${this.right_button_id}`).addEventListener("click", this.incrementTemperature);
    }

    disconnectedCallback() {
      this.right.removeEventListener("click", this.incrementTemperature);
      this.left.removeEventListener("click", this.decrementTemperature);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("number-input", NumberInput);
  });
})();

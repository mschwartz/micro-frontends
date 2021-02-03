/*
 * this is an ugly piece of code.
 * The filter field input event needs to re-render the favorites/channels list with the 
 * filtered values.  We can't re-render the whole dialog - this.modal becomes invalid.
 * 
 * So the solution is to re-render only the modal body/table.  The event listeners for 
 * clicking on the table rows would become invalid, so those have to be removed first.
 * After rendering the new table, new event listeners have to be added.
 */

(() => {
  let modal_id = 0;
  class TiVoFavorites extends HTMLElement {
    constructor() {
      super();
      this.device = this.getAttribute("device");
      this.guide = this.getAttribute("guide");
      this.channels = MQTT.cached(`tvguide/${this.guide}/status/channels`);
      // this.channels = JSON.parse(this.getAttribute("channels"));
      const boxes = window.Config.tivo.boxes;
      for (const box of boxes) {
        if (box.device === this.device) {
          this.favorites = box.favorites;
        }
      }
      // this.favorites = window.Config.tivos.boxes[this.device].favorites;
      this.state = {
        display: "favorites",
        filter: "",
        shown: false,
      };

      this.modal = null;
      this._id = ++modal_id;
      this.modal_id = "tivo-favorites-modal-" + this._id;
      this.table_id = "tivo-favorites-table-" + this._id;
      this.close_button = "tivo-favorites-close-button-" + this._id;

      //
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
      e.stopPropagation();
      const channel = e.target.getAttribute("data-channel");
      if (channel) {
        // publish
        MQTT.publish(`tivo/${this.device}/set/command`, "0" + channel);
      }
      this.hide();
    }

    show() {
      if (this.modal) {
        if (!this.state.shown) {
          this.modal.show();
        }
        this.state.shown = true;
        this.dispatchEvent(new CustomEvent("show"));
      }
    }

    isFiltered(...args) {
      const filter = this.state.filter;
      if (filter === "") {
        return false;
      }
      const re = new RegExp(this.state.filter.toUpperCase());

      for (const arg of args) {
        if (re.test(arg.toUpperCase())) {
          return false;
        }
      }

      return true;
    }

    hide() {
      if (this.modal) {
        this.modal.hide();
        this.dispatchEvent(new CustomEvent("hide"));
      } else {
        console.log("no modal");
      }
      this.state.shown = false;
    }

    addListListeners() {
      const favs = [];

      for (let row = 0; row < this.favorites.length; row++) {
        if (
          !this.isFiltered(
            this.favorites[row].name,
            this.favorites[row].channel
          )
        ) {
          favs.push(this.favorites.row);
        }
      }

      for (let row = 0; row < favs.length; row++) {
        const row_id = `tivo-favorites-${this._id}-${row}`,
          el = document.getElementById(row_id);
        // console.log("add row_id", row_id, el);
        try {
          el.addEventListener("click", this.handleClick);
        } catch (e) {
          console.log("can't add ", row_id, el, favs, favs.length);
        }
      }
    }

    removeListListeners() {
      const favs = [];

      for (let row = 0; row < this.favorites.length; row++) {
        if (
          !this.isFiltered(
            this.favorites[row].name,
            this.favorites[row].channel
          )
        ) {
          favs.push(this.favorites.row);
        }
      }

      for (let row = 0; row < favs.length; row++) {
        const row_id = `tivo-favorites-${this._id}-${row}`,
          el = document.getElementById(row_id);
        // console.log("add row_id", row_id, el);
        try {
          el.removeEventListener("click", this.handleClick);
        } catch (e) {
          console.log("can't remove ", row_id, el, favs, favs.length);
        }
      }
      
    }

    renderFavorites() {
      if (!this.favorites) {
        console.log("no favorites");
        return "";
      }

      let html = `
	    <table id=${this.table_id} class="table table-striped table-sm table-borderless">
	    <tbody>
        `;

      const favorites = this.favorites,
        channels = this.channels;

      let row = 0;
      for (const index of Object.keys(favorites)) {
        const favorite = favorites[index],
          channel = channels[favorite.channel];

        if (!this.isFiltered(favorite.name, favorite.channel)) {
          html += `
	    <tr id="tivo-favorites-${this._id}-${row++}"  data-channel="${
            favorite.channel
          }">
		<td data-channel="${favorite.channel}">
		    <img src="${channel.logo.URL}" style="width: 60px" data-channel="${
            favorite.channel
          }"/>
		</td>
		<td class="align-middle" data-channel="${favorite.channel}">
		    ${favorite.name}
		</td data-channel=${favorite.channel}">
		<td class="align-middle" data-channel="${favorite.channel}">
		    ${favorite.channel}
		</td>

	    </tr>
	  `;
        }
      }
      html += `
	    </tbody>
	    </table>
	`;
      return html;
    }

    get template() {
      const renderFilterField = () => {
        return `
	    <div style="margin-bottom: 18px">
		<form>
		    <input 
			type="text" 
			id="favorites-filter-field"
			class="form-control" 
			style="width: 100%" 
			placeholder="Filter"
		    />
		</form>
	    </div>
	`;
      };

      return `
<div class="modal fade" id="${this.modal_id}">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Favorites</h2>
      </div>
      <div class="modal-body">
	    ${renderFilterField()}
	<div style="height: 480px; overflow: auto" id="tivo-favorites-list">
	    ${this.renderFavorites()}
	</div>
      </div>
      <div class="modal-footer">
        <button class="btn" id="${this.close_button}">Close</button>
      </div>
    </div>
  </div>
</div>
`;
    }

    render(inner) {
      try {
        for (const row = 0; row < this.favorites.length; row++) {
          document
            .getElementById("tivo-favorites-" + this._id + "-" + row)
            .removeEventListener("click", this.handleClick);
        }
        document
          .getElementById(this.close_button)
          .removeEventListener("click", this.handleClick);
      } catch (e) {
        // we don't care if the remove failed
      }

      const show = this.getAttribute("show") === "true";
      if (!this.show) {
        return "";
      }

      const t = this.template;
      this.innerHTML = t;

      this.el = document.getElementById(this.modal_id);

      if (this.modal === null && this.el) {
        // console.log("NEW");
        this.modal = new bootstrap.Modal(this.el, {
          focus: true,
          // backdrop: "static",
        });
      }

      try {
        document
          .getElementById(this.close_button)
          .addEventListener("click", this.handleClick);

        document
          .getElementById("favorites-filter-field")
          .addEventListener("input", (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log("change", e.target.value);
            this.removeListListeners();
            this.state.filter = e.target.value;
            document.getElementById("tivo-favorites-list").innerHTML = this.renderFavorites();
            this.addListListeners();
            // this.render(true);
            // this.setState({ filter: e.target.value});
          });
      } catch (e) {
        console.log("can't add!");
      }

      this.addListListeners();
      
      if (show) {
        console.log("show");
        this.show();
      } else {
        console.log("hide");
        this.hide();
      }
    }

    connectedCallback() {
      this.render();
      // document.addEventListener("tivo", this.handleTiVo);
      // document.addEventListener("guide", this.handleGuide);
      // this.tivo = new TiVo(this.device, this.favvorites);
      // this.tivo.subscribe();
      // this.guide = new Guide(this.guide);
      // this.guide.subscribe();
    }

    disconnectedCallback() {
      // document.removeEventListener("tivo", this.handleTiVo);
      // document.removeEventListener("guide", this.handleGuide);
      // this.tivo.unsubscribe();
      // this.guide.unsubscribe();
      this.hide();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("tivo-favorites", TiVoFavorites);
  });
})();

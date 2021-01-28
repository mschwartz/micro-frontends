(() => {
  const LOCALSTORAGE_KEY = "dashboard-tab";

  class DashboardsScreen extends HTMLElement {
    constructor() {
      super();
      this.child_elements = this.innerHTML;
      this.selected_key =
        localStorage.getItem(LOCALSTORAGE_KEY) || "theater-tab";
    }

    tiles(dashboard) {
      let html = "";
      dashboard.tiles.map((tile) => {
        switch (tile.type) {
          case "clock":
            html += `<clock-tile location=${tile.location}></clock-tile>`;
            break;
          case "weather":
            html += `<weather-tile location=${tile.location}></weather-tile>`;
            break;
          case "thermostat":
            html += `<thermostat-tile zone="${tile.zone}"></thermostat-tile>`;
            break;
          case "theater":
            html += `<theater-tile title="${tile.title}"></theater-tile>`;
            break;
          case "pool":
            html += `<pool-tile></pool-tile>`;
            break;
          case "spa":
            html += `<spa-tile></spa-tile>`;
            break;
          case "presence":
            html += `<presence-tile people='${JSON.stringify(
              tile.people
            )}'></presence-tile>`;
            break;
          case "lock":
            html += `<lock-tile hub="${tile.hub}" device="${tile.device}" title="${tile.title}"></lock-tile>`;
            break;
          case "ring":
            html += `<ring-tile location="${tile.location}" device="${tile.device}"></ring-tile>`;
            break;
          case "rgb":
            console.log("rgb", tile);
            html += `<rgb-tile></rgb-tile>`;
            break;
          case "garagedoor":
            html += `<garagedoor-tile title="${tile.title}" device="${tile.device.device}"></garagedoor-tile>`;
            break;
          case "fan":
            html += `<fan-tile>${tile.device}</fan-tile>`;
            break;
          case "switch":
            html += `<switch-tile>${tile.device}</switch-tile>`;
            break;
          case "dimmer":
            html += `<dimmer-tile>${tile.device}</dimmer-tile>`;
            break;
          case "macro":
            html += `<macro-tile>${tile.label}</macro-tile>`;
            break;
          case "blank":
            html += `<blank-tile></blank-tile>`;
            break;
        }
      });
      return html;
    }

    get template() {
      let html = `
<nav>
  <div class="nav nav-tabs" id="dashboard-tab" role="tablist">
`;

      window.Config.dashboards.map((dashboard) => {
        const active =
          `${dashboard.key}-tab` === this.selected_key ? " active" : "";
        html += `
    <a 
      class="nav-link${active}" 
      id="${dashboard.key}-tab" 
      data-bs-toggle="tab" 
      role="tab" 
      aria-controls="${dashboard.key}-panel" 
      href="#${dashboard.key}-panel"
    >
      ${dashboard.title}
    </a>
`;
      });

      html += `
  </div>
</nav>
`;

      html += `<div class="tab-content" id="dashboard-tabContent">\n`;
      window.Config.dashboards.map((dashboard) => {
        if (`${dashboard.key}-tab` === this.selected_key) {
          html += `
  <div 
    class="tab-pane active show" 
    id="${dashboard.key}-panel" 
    role="tabpanel" 
    aria-labelledby="${dashboard.key}-tab"
   >
     ${this.tiles(dashboard)}
   </div>
`;
        } else {
          html += `
  <div 
    class="tab-pane" 
    id="${dashboard.key}-panel" 
    role="tabpanel" 
    aria-labelledby="${dashboard.key}-tab"
   >
   </div>
`;
        }
      });
      html += "</div>\n";

      return html;
    }

    render() {
      if (!window.Config) {
        return;
      }

      const html = this.template;
      this.innerHTML = html;
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        this.render();
      }
    }

    connectedCallback() {
      this.render();
      this.addEventListener("click", (e) => {
        const id = e.target.id;
        console.log(`Dashboards clicked! id(${id})`);
        if (id && id.indexOf("-tab") !== -1) {
          this.selected_key = e.target.id;
          localStorage.setItem(LOCALSTORAGE_KEY, this.selected_key);
          this.render();
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    customElements.define("dashboards-screen", DashboardsScreen);
  });
})();

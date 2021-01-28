// encapsulates all the devices and activities of a theater
class Theater {
  constructor(title) {
    console.log("Theater", title);
    this.title = title;
    this.theater = null;
    for (const theater of window.Config.theaters) {
      if (theater.title === title) {
        this.theater = theater;
        break;
      }
    }

    this.activities = this.theater.activities;
    this.devices = this.theater.devices;

    this.state = {
      currentActivity: { name: "All Off" },
      currentDevice: { name: "None" },
      devices: this.devices,
      avr: {
        power: false,
        input: "",
        mute: false,
        masterVolume: 0,
        surroundMode: "",
        centerVolume: 0,
        inputMode: "AUTO",
      },
      appletv: null,
      roku: null,
      tivo: null,
      tv: { power: false },
    };

    for (const activity of this.activities) {
      const inputs = activity.inputs;
      if (inputs) {
        if (inputs.tv) {
          if (!Array.isArray(inputs.tv)) {
            inputs.tv = [inputs.tv];
          }
          for (let i = 0; i < inputs.tv.length; i++) {
            inputs.tv[i] = mangle(inputs.tv[i]);
          }
        }
        if (inputs.avr) {
          if (!Array.isArray(inputs.avr)) {
            inputs.avr = [inputs.avr];
          }
          for (let i = 0; i < inputs.avr.length; i++) {
            inputs.avr[i] = mangle(inputs.avr[i]);
          }
        }
      }
    }

    for (const device of this.devices) {
      switch (device.type) {
        case "bravia":
          this.state.tv = device;
          break;
        case "lgtv":
          this.state.tv = device;
          break;
        case "denon":
          this.state.avr = device;
          break;
        case "appletv":
          this.state.appletv = device;
          break;
        case "tivo":
          this.state.tivo = device;
          break;
        case "harmony":
          this.state.harmony = device;
          break;
        case "roku":
          this.state.roku = device;
          break;
        default:
          break;
      }
    }

    //
    this.handleAppleTVMessage = this.handleAppleTVMessage.bind(this);
    this.handleBraviaMessage = this.handleBraviaMessage.bind(this);
    this.handleLGTVMessage = this.handleLGTVMessage.bind(this);
    this.handleDenonMessage = this.handleDenonMessage.bind(this);
    this.handleRokuMessage = this.handleRokuMessage.bind(this);
    this.handleTiVoMessage = this.handleTiVoMessage.bind(this);
    this.handleGuideMessage = this.handleGuideMessage.bind(this);
  }

  get eventType() {
    return `Theater(${this.title})`;
  }

  setState(o) {
    let changed = false;
    for (const key of Object.keys(o)) {
      if (JSON.stringify(this.state[key]) !== JSON.stringify(o[key])) {
        this.state[key] = o[key];
        changed = true;
      }
    }
    if (changed) {
      const topic = this.eventType;
      document.dispatchEvent(new CustomEvent(topic, { detail: this.state }));
    }
  }

  handleInputChange(state) {
    try {
      if (!state.tv) {
        state = this.state;
      }
      if (state.avr && state.avr.power === false) {
        state.avr.input = "OFF";
      }
      if (state.tv && state.tv.power === false) {
        // state.tv.input = "OFF";
        state.currentActivity = { name: "All Off" };
        // state.currentDevice = null;
        return;
      }
      if (state.avr && state.tv.avr === false) {
        state.currentActivity = { name: "All Off" };
        // state.currentDevice = null;
        return;
      }

      const tvInput = mangle(state.tv.input),
        avrInput = mangle(state.avr.input);

      if (tvInput === undefined || avrInput === undefined) {
        return;
      }

      for (const activity of this.activities) {
        const inputs = activity.inputs;
        if (inputs) {
          if (
            inputs.tv.indexOf(tvInput) !== -1 &&
            inputs.avr.indexOf(avrInput) !== -1
          ) {
            state.currentActivity = activity;
            state.currentDevice = this.findDevice(activity.defaultDevice);
            return;
          }
        } else {
          state.currentActivity = activity;
          state.currentDevice = null;
        }
      }
    } catch (e) {}
  }

  findDevice(name) {
    for (const device of this.devices) {
      if (mangle(device.name) === mangle(name)) {
        return device;
      }
    }
    return null;
  }

  startActivity(activity) {
    this.setState({
      currentActivity: activity,
      currentDevice: this.findDevice(activity.defaultDevice),
    });

    if (activity.macro) {
      MQTT.publish("macros/run", activity.macro);
    }
  }

  startDevice(device) {
    this.setState({ currentDevice: device });
  }

  handleAppleTVMessage(e) {
    try {
      const state = Object.assign({}, this.state);
      state.info = e.detail;
      this.setState(state);
    } catch (e) {}
  }

  handleBraviaMessage(e) {
    try {
      const t = e.type.split("/").pop(),
        state = Object.assign({}, this.state);
      switch (t) {
        case "power":
          state.tv.power = isOn(e.detail);
          break;
        case "input":
          state.tv.input = e.detail.toUpperCase();
          break;
        default:
          console.log("Invalid bravia message", e.type, e.detail);
          break;
      }
      this.handleInputChange(state);
      this.setState(state);
    } catch (e) {}
  }

  handleLGTVMessage(e) {
    try {
      const t = e.type.split("/").pop(),
        state = Object.assign({}, this.state);
      switch (t) {
        case "power":
          state.tv.power = isOn(e.detail);
          this.handleInputChange(state);
          break;
        case "launchPoints":
          state.launchPoints = e.detail;
          if (state.foregroundApp) {
            const foregroundApp = state.foregroundApp;
            const app = state.launchPoints[foregroundApp.appId];
            // console.log("app", app);
            const title = app.title;
            // console.log("title", title);
            const lp = title || "unknown";
            const inp = state.tv.power ? lp : "OFF";

            state.tv.input = inp;
            // console.log("foregroundApp", state.foregroundApp, title, lp, inp);
            state.tv.input = inp;
            // console.log("change", inp);
            this.handleInputChange(state);
          } else {
            state.tv.input = "OFF";
            this.handleInputChange(state);
          }
          break;
        case "foregroundApp":
          // console.log("foregroundApp", e.detail);
          state.foregroundApp = e.detail;
          if (!state.launchPoints) {
            state.tvInput = "OFF";
            // console.log("change OFF");
            this.handleInputChange(state);
          } else {
            const foregroundApp = state.foregroundApp;
            if (foregroundApp.appId !== "") {
              const app = state.launchPoints[foregroundApp.appId];
              // console.log("app", app);
              const title = app.title;
              // console.log("title", title);
              const lp = title || "unknown";
              const inp = state.tv.power ? lp : "OFF";

              state.tv.input = inp;
            }
            this.handleInputChange(state);
          }
          break;
        default:
          return;
      }
      this.setState(state);
    } catch (e) {}
  }

  handleDenonMessage(e) {
    try {
      const t = e.type.split("/").pop();
      const state = Object.assign({}, this.state);

      switch (t) {
        case "PW":
          state.avr.power = isOn(e.detail);
          if (!state.avr.power) {
            this.avr.input = "OFF";
          }
          this.handleInputChange(state);
          break;
        case "SI":
          // console.log("SI", e.detail);
          state.avr.input = e.detail;
          this.handleInputChange(state);
          break;
        case "MU":
          state.avr.mute = e.detail !== "OFF";
          break;
        case "MV":
          state.avr.masterVolume = parseInt("" + e.detail, 10);
          break;
        case "MS":
          state.avr.surroundMode = e.detail;
          break;
        case "CVC":
          let m = "" + e.detail,
            v = parseInt(m, 10);
          if (m.length === 2) {
            v *= 10;
          }
          state.avr.centerVolume = v;
          break;
        case "DC":
          state.avr.inputMode = e.detail;
          break;
        default:
          return;
      }
      this.setState(state);
    } catch (e) {}
  }

  handleRokuMessage(e) {
    this.setState({ roku: e.detail });
  }

  handleTiVoMessage(e) {
    if (~e.type.indexOf("channel")) {
      this.setState({ channel: e.detail });
    } else if (~e.type.indexOf("mode")) {
      this.setState({ mode: e.detail });
    }
  }

  handleGuideMessage(e) {
    this.setState({ channels: e.detail });
  }

  subscribe() {
    this.devices.map((device) => {
      switch (device.type) {
        case "appletv":
          this.appletv = device;
          MQTT.subscribe(
            `appletv/${device.device}/status/info`,
            this.handleAppleTVMessage
          );
          break;

        case "bravia":
          this.tv = device;
          MQTT.subscribe(
            `bravia/${device.device}/status/power`,
            this.handleBraviaMessage
          );
          MQTT.subscribe(
            `bravia/${device.device}/status/input`,
            this.handleBraviaMessage
          );
          break;

        case "lgtv":
          this.tv = device;
          MQTT.subscribe(
            `lgtv/${device.device}/status/power`,
            this.handleLGTVMessage
          );
          MQTT.subscribe(
            `lgtv/${device.device}/status/launchPoints`,
            this.handleLGTVMessage
          );
          MQTT.subscribe(
            `lgtv/${device.device}/status/foregroundApp`,
            this.handleLGTVMessage
          );
          break;

        case "tivo":
          this.tivo = device;
          MQTT.subscribe(
            `tivo/${device.device}/status/channel`,
            this.handleTiVoMessage
          );
          MQTT.subscribe(
            `tvguide/${device.guide}/status/channels`,
            this.handleGuideMessage
          );
          break;

        case "denon":
          this.avr = device;
          MQTT.subscribe(
            `denon/${device.device}/status/SI`,
            this.handleDenonMessage
          );
          MQTT.subscribe(
            `denon/${device.device}/status/MU`,
            this.handleDenonMessage
          );
          MQTT.subscribe(
            `denon/${device.device}/status/PW`,
            this.handleDenonMessage
          );
          MQTT.subscribe(
            `denon/${device.device}/status/MV`,
            this.handleDenonMessage
          );
          MQTT.subscribe(
            `denon/${device.device}/status/MS`,
            this.handleDenonMessage
          );
          MQTT.subscribe(
            `denon/${device.device}/status/CVC`,
            this.handleDenonMessage
          );
          MQTT.subscribe(
            `denon/${device.device}/status/DC`,
            this.handleDenonMessage
          );
          break;

        default:
          break;
      }
      return false;
    });
  }

  unsubscribe() {
    this.devices.map((device) => {
      switch (device.type) {
        case "appletv":
          MQTT.unsubscribe(
            `appletv/${device.device}/status/info`,
            this.handleAppleTVMessage
          );
          break;
        case "bravia":
          MQTT.unsubscribe(
            `bravia/${device.device}/status/power`,
            this.handleBraviaMessage
          );
          MQTT.unsubscribe(
            `bravia/${device.device}/status/input`,
            this.handleBraviaMessage
          );
          break;

        case "lgtv":
          MQTT.unsubscribe(
            `lgtv/${device.device}/status/power`,
            this.handleLGTVMessage
          );
          MQTT.unsubscribe(
            `lgtv/${device.device}/status/input`,
            this.handleLGTVMessage
          );
          break;

        case "tivo":
          this.tivo = device;
          MQTT.unsubscribe(
            `tivo/${device.device}/status/channel`,
            this.handleTiVoMessage
          );
          MQTT.unsubscribe(
            `tvguide/${device.guide}/status/channels`,
            this.handleGuideMessage
          );
          break;

        case "denon":
          this.avr = device;
          MQTT.unsubscribe(
            `denon/${device.device}/status/SI`,
            this.handleDenonMessage
          );
          MQTT.unsubscribe(
            `denon/${device.device}/status/MU`,
            this.handleDenonMessage
          );
          MQTT.unsubscribe(
            `denon/${device.device}/status/PW`,
            this.handleDenonMessage
          );
          MQTT.unsubscribe(
            `denon/${device.device}/status/MV`,
            this.handleDenonMessage
          );
          MQTT.unsubscribe(
            `denon/${device.device}/status/MS`,
            this.handleDenonMessage
          );
          MQTT.unsubscribe(
            `denon/${device.device}/status/CVC`,
            this.handleDenonMessage
          );
          MQTT.unsubscribe(
            `denon/${device.device}/status/DC`,
            this.handleDenonMessage
          );
          break;

        default:
          break;
      }
      return false;
    });
  }
}

class TiVo {
  constructor(device) {
    console.log("new TiVo", device);
    this.device = device;
    console.log(window.Config);
    for (const box of window.Config.tivo.boxes) {
      if (device === box.device) {
        this.config = box;
        break;
      }
    }
    console.log("CONFIG", this.config);
    this.favorites = this.config.favorites;
    console.log("favorites", this.favorites);
    this.state = {};
    //
    this.handleTiVoMessage = this.handleTiVoMessage.bind(this);
  }

  get eventType() {
    return "tivo";
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

  handleTiVoMessage(e) {
    if (~e.type.indexOf("channel")) {
      this.setState({ channel: e.detail });
    } else if (~e.type.indexOf("mode")) {
      this.setState({ mode: e.detail });
    }
  }

  subscribe() {
    MQTT.subscribe(
      `tivo/${this.device}/status/channel`,
      this.handleTiVoMessage
    );
    MQTT.subscribe(`tivo/${this.device}/status/mode`, this.handleTiVoMessage);
  }

  unsubscribe() {
    MQTT.unsubscribe(
      `tivo/${this.device}/status/channel`,
      this.handleTiVoMessage
    );
    MQTT.unsubscribe(`tivo/${this.device}/status/mode`, this.handleTiVoMessage);
  }
}

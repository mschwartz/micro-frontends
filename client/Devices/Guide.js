class Guide {
  constructor(guide) {
    this.guide = guide;
    this.state = {};
    //
    this.handleGuideMessage = this.handleGuideMessage.bind(this);
  }

  get eventType() { return "guide"; }

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

  handleGuideMessage(e) {
    console.log("GUIDE", e.detail);
    this.setState({ channels: e.detail });
  }

  subscribe() {
    MQTT.subscribe(
      `tvguide/${this.guide}/status/channels`,
      this.handleGuideMessage
    );
  }

  unsubscribe() {
    MQTT.unsubscribe(
      `tvguide/${this.guide}/status/channels`,
      this.handleGuideMessage
    );
  }
}

class MQTTEvent extends CustomEvent {
  constructor(topic, message) {
    super([topic, message]);
    this.topic = topic;
    this.message = message;
    try {
      this.message = JSON.parse(message);
    } catch (e) {}
  }
}

class MQTTSingleton {
  constructor() {
    this.connect = this.connect.bind(this);
    this.cache = {};
    this.host = "nuc1";
    this.port = 1883;
    this.url = `ws://${this.host}`;
    this.subscriptions = {};
    this.subscription_queue = [];
    this.interval = null;
    this.connected = false;
    this.connect();
  }

  connect() {
    this.mqtt = mqtt.connect(this.url);
    this.mqtt.on("connect", this.onConnect.bind(this));
    this.mqtt.on("failure", this.onFailure.bind(this));
    this.mqtt.on("message", this.onMessage.bind(this));
    this.mqtt.on("close", this.onClose.bind(this));
  }

  onConnect() {
    console.log("MQTT CONNECTED!");
    this.mqtt.subscribe("reload");
    this.connected = true;
  }

  onFailure(...e) {
    console.log("MQTT FAILURE!", ...e);
  }

  onClose(...e) {
    console.log("MQTT CLOSE!", ...e);
  }

  onMessage(topic, payload) {
    if (topic === "reload") {
      window.location.reload();
      return;
    }

    this.cache[topic] = payload.toString();
    if (!this.subscriptions[topic]) {
      // this.mqtt.unsubscribe(topic);
      this.subscriptions[topic] = 0;
    } else {
      console.log(
        "%cmessage <<< %c" + topic + " %c" + payload.toString().substr(0, 40),
        "font-weight: bold;",
        "color:red; font-weight: bold",
        "color:blue; font-weight: bold"
      );
      document.dispatchEvent(
        new CustomEvent(topic, { detail: JSON.parse(payload.toString()) })
      );
    }
  }

  subscribe(topic) {
    if (!this.connected) {
      this.subscription_queue.push(topic);
      if (!this.interval) {
        this.interval = setInterval(() => {
          if (this.connected) {
            let topic;
            while ((topic = this.subscription_queue.pop())) {
              if (!this.subscriptions[topic]) {
                this.subscriptions[topic] = 0;
                this.mqtt.subscribe(topic);
              }
              this.subscriptions[topic]++;
            }
            clearInterval(this.interval);
            this.interval = null;
          }
        }, 10);
      }
      return;
    }
    if (!this.subscriptions[topic]) {
      this.subscriptions[topic] = 0;
      this.mqtt.subscribe(topic);
    }
    this.subscriptions[topic]++;
    const payload = this.cache[topic];
    if (payload) {
      document.dispatchEvent(
        new CustomEvent(topic, { detail: JSON.parse(payload.toString()) })
      );
    }
  }

  unsubscribe(topic) {
    if (this.subscriptions[topic]) {
      this.subscriptions[topic]--;
    }
    if (this.subscriptions[topic] === 0) {
      this.mqtt.unsubscribe(topic);
    }
  }

  publish(topic, message) {
    if (typeof message !== "string") {
      message = JSON.stringify(message);
      this.mqtt.publish(topic, message);
      console.log(
        "%cmessage >>> %c" + topic + " %c" + message,
        "font-weight: bold;",
        "color:red; font-weight: bold",
        "color:blue; font-weight: bold"
      );
    } else {
      this.mqtt.publish(topic, String(message));
      console.log(
        "%c>>> message %c" + topic + " %c" + String(message),
        "font-weight: bold;",
        "color:red; font-weight: bold",
        "color:blue; font-weight: bold"
      );
    }
  }
}

var MQTT = new MQTTSingleton();

const express = require("express"),
  MQTT = require("mqtt"),
  app = express(),
  port = 4000;

app.use(express.static("client"));

app.get("/", (req, res) => {
  res.send("hello, world");
});

const mqtt = MQTT.connect("ws://nuc1");
mqtt.on("connect", () => {
  console.log("MQTT connected");
  mqtt.publish("reload", "reload", { retain: false});
  app.listen(port, () => {
    console.log("listening on port ", port);
  });
});

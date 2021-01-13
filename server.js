const express = require("express"),
  app = express(),
  port = 4000;

app.use(express.static('client'));

app.get('/', (req, res) => {
  res.send("hello, world");
});

app.listen(port, () => {
  console.log("listening on port ", port);
});

const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { default: mongoose } = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;
const env = process.env.NODE_ENV;

require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database CONNECTED");
  })
  .catch((err) => {
    console.log("Database ERROR", err);
  });

app.use(cors());

if (env === "DEVELOPMENT") {
app.use(require("./routes/gateway/webHook"));
} else {
  app.use('/api',require("./routes/gateway/webHook"));
}

// Cokkies Creation
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));
app.use(cookieParser());

if (env === "DEVELOPMENT") {
  app.use(require("./auth"));
  app.use(require("./routes/index"));
} else {
  app.use(`/api`, require("./auth"));
  app.use(`/api`, require("./routes/index"));
}

// app.use(require("./auth"));

app.use(express.static(path.resolve(__dirname, "Client", "docs")));

app.get("/", (req, res) => {
  console.log(path.resolve(__dirname, "Client", "docs"));
  res.status(200).sendFile(path.resolve(__dirname, "Client", "docs"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/Client/docs/index.html"));
});

app.listen(PORT, () => {
  console.log("Server Connected 5000");
});

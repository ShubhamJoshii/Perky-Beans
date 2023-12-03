const express = require('express');
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const app = express();
const PORT = process.env.PORT || 5000;

require("dotenv").config();

app.use(cors());

// Cokkies Creation
app.use(express.json({limit:"25mb"}));
app.use(express.urlencoded({limit:"25mb"}));
app.use(cookieParser());

app.use(require("./auth"));

app.use(express.static(path.resolve(__dirname, "Client", "docs")));

app.get("/", (req, res) => {
  console.log(path.resolve(__dirname, "Client", "docs"));
  res.status(200).sendFile(path.resolve(__dirname, "Client", "docs"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/Client/docs/index.html"));
});

app.listen(PORT,()=>{
    console.log("Server Connected 5000")
})
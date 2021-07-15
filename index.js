const express = require("express");
const app = express();

//NOTE 3rd party middlewares
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

//NOTE Routes
const authRoutes = require("./routes/authRoute");
const privateRoute = require("./routes/privateRoute");

//NOTE Middlewares

app.use(express.json());


app.use(
  cors({
    origin:["https://www.codengeek.tech", "http://localhost:3000"],
    credentials: true
  })
);
app.use(cookieParser());
app.use(morgan("dev"));

//NOTE Routes
app.use("/api/v1/", authRoutes);
app.use("/api/v1/", privateRoute);

app.get("/", (req, res) => res.send("The codengeek server is running🚀"));

module.exports = app;

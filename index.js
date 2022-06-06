const express = require("express");
const app = express();

//NOTE 3rd party middlewares
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

//NOTE Routes
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const blogRoutes = require("./routes/blogRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

//NOTE Middlewares
app.use(express.json());

app.use(
  cors({
    origin: [
      "https://codengeek.netlify.app/",
      "http://localhost:3000"
    ],
    credentials: true
  })
);

// app.use("/images", express.static(path.join(__dirname, "/images")));

app.use(cookieParser());
app.use(morgan("dev"));

//NOTE Routes
app.use("/api/v1/", authRoutes);
app.use("/api/v1/", userRoutes);
app.use("/api/v1/", blogRoutes);
app.use("/api/v1/", categoryRoutes);

app.get("/", (req, res) => res.send("The codengeek server is running🚀"));

module.exports = app;

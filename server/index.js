const express = require("express");
require("dotenv").config();
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter");
const cardRouter = require("./routes/cardRouter");
const mongoose = require("mongoose");

const frontend =
  process.env.NODE_ENV === "production"
    ? process.env.FRONT_END_HOSTED
    : process.env.FRONT_END_LOCAL;

const app = express();
app.use(
  cors({
    origin: frontend,
    credentials: true,
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static("images"));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

app.get("/", (req, res) => {
  res.json({ message: "Hie :3" });
});

// Pinging server to wake up
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(frontend);

  console.log(`Server is running on port ${process.env.PORT}`);
});

app.use("/api/auth", authRouter);
app.use("/api/card", cardRouter);

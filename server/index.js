const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter");

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Hie :3" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});


app.use("/api/auth", authRouter);
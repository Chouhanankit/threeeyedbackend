const express = require("express");
require("dotenv").config();
const cors = require("cors");
const user = require("./routes/userRoutes");
const { connectDB } = require("./config/dbconfig");
const { errorHandler } = require("./middleware/userMiddleware");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));

app.use("/api/user", user);
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is Running on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err.message);
    process.exit(1);
  });

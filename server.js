const express = require("express");
require("dotenv").config();
const app = express();
const user = require("./routes/userRoutes");
const { connectDB } = require("./config/dbconfig");
const { errorHandler } = require("./middleware/userMiddleware");
const cors = require("cors");

const PORT = process.env.PORT || 4000;

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: '*' }));
app.use("/api/user", user);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is Running on PORT: ${PORT}`);
});

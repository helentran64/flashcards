const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mysqlPool = require("./config/db");
const cors = require('cors');

dotenv.config({ path: "./.env" });
app.use(express.json());
app.use(cors());

// routes
app.use('/api/user', require('./routes/userRouter.ts'));
app.use('/api/deck', require('./routes/deckRouter.ts'));

const PORT = process.env.PORT || 3000;

mysqlPool.query("SELECT 1").then(() => {
  console.log("Database connection successful");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

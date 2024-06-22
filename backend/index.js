const express = require("express");
const bodyParser = require("body-parser");
const studentRoutes = require("./routes/students");
const markRoutes = require("./routes/marks");
var cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/students", studentRoutes);
app.use("/api/marks", markRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

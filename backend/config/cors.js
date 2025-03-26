const cors = require("cors");

const corsOptions = {
  origin: ["http://localhost:5173"], // Allow frontend domains
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies and authentication headers
  optionsSuccessStatus: 204,
};

module.exports = cors(corsOptions);

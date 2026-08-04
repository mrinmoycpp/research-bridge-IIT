require("dotenv").config();

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
});
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err?.message || err);
});

const express = require("express");
const cors = require("cors");
const path = require("path");
const apiRoutes = require("./src/routes");
const errorHandler = require("./src/middlewares/errorHandler");
const prisma = require("./src/config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "IIT Professor Database API is running",
    endpoints: {
      professors: "/api/professors",
      iits: "/api/iits",
      researchAreas: "/api/research-areas",
      publications: "/api/publications",
      opportunities: "/api/opportunities",
      search: "/api/search/suggestions",
      stats: "/api/stats",
    },
  });
});

app.use("/api", apiRoutes);

const clientBuild = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientBuild));
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuild, "index.html"));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

prisma.$connect()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  });

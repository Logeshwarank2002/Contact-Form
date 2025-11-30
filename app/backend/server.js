import express from "express";
import cors from "cors";
import router from "./contact-data.js"; // ES module import

const app = express();

app.use(express.json());
app.use(cors({
  origin: ["https://stuck-baseline-express-aerial.trycloudflare.com", "http://localhost:3000"],
  methods: "GET,POST",
  allowedHeaders: "Content-Type",
}));

// Contact form routes
app.use("/contact", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

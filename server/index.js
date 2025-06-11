import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import router from "./routes/routes.js";

dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());

connectDB();
app.use("/app", router);

app.get("/", async (req, res) => {
  res.send("App is running");
});

app.listen(port || 8080, () => {
  console.log(`Server is running at port ${port}`);
});

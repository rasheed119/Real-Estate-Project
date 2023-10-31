import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { UserRouter } from "./Router/UserRouter.js";
import { Listing_Router } from "./Router/ListingRouter.js";
import cors from "cors";
import path from "path";

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Error Connecting to MongoDB ", error.message));

const __dirname = path.resolve();

app.get("/", (req, res) => {
  res.status(200).json({ Project_Name: "Real Estate MERN App" });
});

app.use("/user", UserRouter);
app.use("/listings", Listing_Router);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.listen(9000, () => {
  console.log("Server is running on Port 9000");
});

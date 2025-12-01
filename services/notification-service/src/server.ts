import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 4004;

app.listen(port, () => {
  console.log(`Notification service is running on port ${port}`);
});

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.DATABASE_URL || "mongodb://localhost:27017/notification"
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

connectDB();

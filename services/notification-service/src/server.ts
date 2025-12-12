import mongoose from "mongoose";
require("dotenv").config({ path: "./config.env" });

import kafkaService from "./kafka/kafka";

import app from "./app";


const port = process.env.PORT || 4004;

app.listen(port, () => {
  console.log(`Notification service is running on port ${port}`);
});

const connectDB = async () => {
  try {
    await kafkaService.connect();
    await kafkaService.startConsumer()
    await mongoose.connect(
      process.env.DATABASE_URL || "mongodb://localhost:27017/notification"
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

connectDB();

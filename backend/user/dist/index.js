import dotenv from "dotenv";
dotenv.config({
    quiet: true
});
import express from "express";
import connectDb from "./config/db.js";
import { createClient } from "redis";
import userRoute from "./routes/user.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import cors from "cors";
connectRabbitMQ();
export const redisClient = createClient({
    url: process.env.REDIS_URL
});
redisClient.connect()
    .then(() => console.log("connected to redis"))
    .catch(console.error);
connectDb();
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.use("/api/v1", userRoute);
app.listen(port, () => {
    console.log("server  is running");
});
//# sourceMappingURL=index.js.map
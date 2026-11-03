import dotenv from "dotenv";
dotenv.config({
    quiet: true
});
import express from "express";
import { startSendOtpConsumer } from "./consumer.js";
// export const redisClient=createClient({
//     url:process.env.REDIS_URL as string
// })
// redisClient.connect()
// .then(()=>console.log("connected to redis"))
// .catch(console.error);
startSendOtpConsumer();
const app = express();
const port = process.env.PORT || 5001;
// app.use("/api/v1",userRoute)
app.listen(port, () => {
    console.log("server  is running");
});
//# sourceMappingURL=index.js.map
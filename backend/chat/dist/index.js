import dotenv from "dotenv";
dotenv.config({
    quiet: true
});
import express from "express";
import chatRoutes from "./routes/chat.js";
import connectDb from "./config/db.js";
import cors from "cors";
connectDb();
const app = express();
const port = process.env.PORT || 5002;
app.use(express.json());
app.use(cors());
app.use("/api/v1", chatRoutes);
app.listen(port, () => {
    console.log("server  is running");
});
//# sourceMappingURL=index.js.map
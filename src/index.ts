import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import MyUserRoutes from "./routes/MyUserRoutes";
import { v2 as cloudinary } from "cloudinary";
import MyShopRoutes from "./routes/MyShopRoutes"

mongoose.connect(process.env.MONGODB_CONNECTION as string).then(() => console.log("DB Connected"));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", async (req: Request, res: Response) => {
    res.send({ message: "health ok!" })
})
app.use("/api/my/user", MyUserRoutes);
app.use("/api/my/shop", MyShopRoutes)


app.listen(7000, () => {
    console.log("Server is Started on 7000 !!");
});
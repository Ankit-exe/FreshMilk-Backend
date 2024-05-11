import { Request, Response } from "express";
import Shop from "../models/shop";
import cloudinary from "cloudinary";
import mongoose from "mongoose";


const updateMyShop = async (req: Request, res: Response) => {
  try {
    const shop = await Shop.findOne({
      user: req.userId,
    })

    if (!shop) {
      return res.status(404).json({ message: "Shop not found!" })
    }

    shop.shopName = req.body.shopName;
    shop.city = req.body.city;
    shop.country = req.body.country;
    shop.deliveryPrice = req.body.deliveryPrice;
    shop.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    shop.cuisines = req.body.cuisines;
    shop.menuItems = req.body.menuItems;
    shop.lastUpdated = new Date();

    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      shop.imageUrl = imageUrl;
    }

    await shop.save();
    res.status(200).send(shop);

  } catch (error) {
    console.log(error);
    res.status(500).json({ meaage: "Something went wrong" })
  }
}


const getMyShop = async (req: Request, res: Response) => {
  try {
    const shop = await Shop.findOne({ user: req.userId });
    if (!shop) {
      return res.status(401).json({ message: "Shop not found!" })
    }

    res.json(shop);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Someting went wrong!" })
  }
}

const createMyShop = async (req: Request, res: Response) => {
  try {
    const existingRestaurant = await Shop.findOne({ user: req.userId });

    if (existingRestaurant) {
      return res
        .status(409)
        .json({ message: "User restaurant already exists" });
    }

    const imageUrl = await uploadImage(req.file as Express.Multer.File);

    const restaurant = new Shop(req.body);
    restaurant.imageUrl = imageUrl;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdated = new Date();
    await restaurant.save();

    res.status(201).send(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
}



export default {
  createMyShop,
  getMyShop,
  updateMyShop
}
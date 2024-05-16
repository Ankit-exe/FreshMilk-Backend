import express from "express";
import { param } from "express-validator";
import ShopController from "../controllers/ShopController";

const router = express.Router();

//api/shop/search/city

router.get("/search/:city", param("city").isString().trim().notEmpty().withMessage("City parameter must be a valid string"), ShopController.searchShop);


export default router;
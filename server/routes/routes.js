import express from "express";
import { register } from "../controllers/register.js";
import { login } from "../controllers/login.js";
import { tokenVerifier } from "../middlewares/tokenVerifier.js";
import { addRestaurant } from "../controllers/owner/addRestaurant.js";
import { getRestautants } from "../controllers/owner/getRestaurants.js";
import { deleteRestaurant } from "../controllers/owner/deleteRestaurant.js";
import restaurantUploader from "../middlewares/restaurantUploader.js";
import { updateRestaurantStatus } from "../controllers/admin/updateRestaurantStatus.js";
import { allRestaurants } from "../controllers/admin/allRestaurants.js";
import { singleRestaurant } from "../controllers/owner/singleRestaurant.js";
import foodUploader from "../middlewares/foodUploader.js";
import { addFood } from "../controllers/owner/addFood.js";
import { getFoods } from "../controllers/owner/getFoods.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("everything works fine");
});

router.post("/register", register);
router.post("/login", login);

router.post(
  "/addRestaurant",
  restaurantUploader.single("img"),
  tokenVerifier,
  addRestaurant
);
router.post("/addFood", foodUploader.single("img"), tokenVerifier, addFood);

router.get("/getRestaurant", tokenVerifier, getRestautants);
router.get("/getFoods/:restaurantId", tokenVerifier, getFoods);
router.delete("/deleteRestaurant", tokenVerifier, deleteRestaurant);
router.get("/getSingleRes/:id", tokenVerifier, singleRestaurant);

router.post(
  "/updateRestaurantStatus/:id",
  tokenVerifier,
  updateRestaurantStatus
);
router.get("/getAllRestaurants", tokenVerifier, allRestaurants);

export default router;

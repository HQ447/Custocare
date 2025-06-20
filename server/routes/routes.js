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
import restaurantUpdator from "../middlewares/restaurantUpdator.js";
import { updateRestaurant } from "../controllers/owner/updateRestaurant.js";
import { getFoodItem } from "../controllers/owner/getFoodItem.js";
import foodUpdator from "../middlewares/foodUpdator.js";
import { updateFoodItem } from "../controllers/owner/updateFoodItem.js";
import { getNearbyRestaurants } from "../controllers/getNearbyRestaurants.js";
import { getAllFoods } from "../controllers/getAllFoods.js";
import { addToOrder } from "../controllers/addToOrder.js";
import { getCartItems } from "../controllers/getCartItems.js";
import { placeOrder } from "../controllers/placeOrder.js";
import { getCustomerOrders } from "../controllers/getAllOrders.js";
import { setRatingFeedback } from "../controllers/setRatingFeedback.js";
import { getFeedbacks } from "../controllers/getFeedbacks.js";
import { getAllFeedbacks } from "../controllers/getAllFeedbacks.js";
import { increment } from "../controllers/increment.js";
import { decrement } from "../controllers/decrement.js";
import { removeCartItem } from "../controllers/removeCartItem.js";
import { getOwnerOrders } from "../controllers/owner/getOwnerOrders.js";
import { updateOrderStatus } from "../controllers/owner/updateOrderStatus.js";
import { getAllUsers } from "../controllers/admin/getAllUsers.js";
import { getAllOrders } from "../controllers/admin/getAllOrders.js";
import { updateUserRole } from "../controllers/admin/updateUserRole.js";
import { deleteUser } from "../controllers/admin/deleteUser.js";
import { deleteFood } from "../controllers/owner/deleteFood.js";
import { getAdminAnalytics } from "../controllers/admin/getAdminAnalytics.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("everything works fine");
});
router.post(
  "/addRestaurant",
  restaurantUploader.single("img"),
  tokenVerifier,
  addRestaurant
);
router.put(
  "/updateRestaurant/:id",
  tokenVerifier,
  restaurantUpdator.single("img"),
  updateRestaurant
);
router.put(
  "/updateFoodItem/:id",
  tokenVerifier,
  foodUpdator.single("img"),
  updateFoodItem
);
router.get("/nearby", getNearbyRestaurants);
router.post("/register", register);
router.post("/login", login);
router.post("/addFood", foodUploader.single("img"), tokenVerifier, addFood);
router.get("/getFoodItem/:id", tokenVerifier, getFoodItem);
router.get("/getAllFoods", getAllFoods);
router.post("/addToOrder", tokenVerifier, addToOrder);
router.get("/getCartItems", tokenVerifier, getCartItems);
router.post("/placeOrder", tokenVerifier, placeOrder);
router.get("/getCustomerOrders", tokenVerifier, getCustomerOrders);
router.post("/ratingFeedback/:id", tokenVerifier, setRatingFeedback);
router.get("/getOwnerOrders", tokenVerifier, getOwnerOrders);
router.put("/updateOrderStatus/:id", tokenVerifier, updateOrderStatus);
router.get("/getAllUsers", tokenVerifier, getAllUsers);
router.get("/getAllOrder", tokenVerifier, getAllOrders);
router.put("/updateUserRole/:id", tokenVerifier, updateUserRole);
router.delete("/deleteUser/:id", tokenVerifier, deleteUser);
router.get("/admin/analytics", tokenVerifier, getAdminAnalytics);
router.get("/getRestaurant", tokenVerifier, getRestautants);
router.get("/getFoods/:restaurantId", tokenVerifier, getFoods);
router.delete("/deleteRestaurant/:id", tokenVerifier, deleteRestaurant);
router.delete("/deleteFoodItem/:id", tokenVerifier, deleteFood);
router.get("/getSingleRes/:id", tokenVerifier, singleRestaurant);
router.get("/getFeedbacks/:id", tokenVerifier, getFeedbacks);
router.get("/getAllFeedbacks", getAllFeedbacks);
router.put("/increment/:id", tokenVerifier, increment);
router.put("/decrement/:id", tokenVerifier, decrement);
router.delete("/removeCartItem/:id", tokenVerifier, removeCartItem);
router.get("/getAllRestaurants", tokenVerifier, allRestaurants);
router.post(
  "/updateRestaurantStatus/:id",
  tokenVerifier,
  updateRestaurantStatus
);

export default router;

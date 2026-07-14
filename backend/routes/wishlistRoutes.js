import { Router } from "express";
import { addToWishlist,removeFromWishlist,getWishlist } from "../controllers/wishlistController.js";
import isUser from "../middleware/authMiddleware.js";

const WishlistRouter=Router()

WishlistRouter.route("/addToWishlist/:productId").post(isUser,addToWishlist)
WishlistRouter.route("/removeFromWishlist/:productId").delete(isUser,removeFromWishlist)
WishlistRouter.route("/getWishlist").get(isUser,getWishlist)

export default WishlistRouter
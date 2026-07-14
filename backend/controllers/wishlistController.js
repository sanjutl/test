import mongoose from "mongoose";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = req.user;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid ProductId",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const alreadyExists = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (alreadyExists) {
      return res.status(409).json({
        message: "Product already in wishlist",
      });
    }

    user.wishlist.push(productId);

    await user.save();

    return res.status(200).json({
      message: "Product added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = req.user;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid ProductId",
      });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );

    await user.save();

    return res.status(200).json({
      message: "Product removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "wishlist",
        populate: {
          path: "subCategoryId",
          select: "name",
        },
      });

    return res.status(200).json({
      message: "Wishlist fetched successfully",
      wishlist: user.wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};
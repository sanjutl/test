import mongoose from "mongoose";
import Product from "../models/productModel.js";
import SubCategory from "../models/subCategoryModel.js";
import path from "path"
import fs from "fs/promises"
const createProduct = async (req, res) => {
  try {
    const { name, description, subCategoryId, variants } = req.body;
    if (!name || !description || !subCategoryId || !variants) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
      return res.status(400).json({ message: "SubcategoryId format error" });
    }
    const existingSubCategory = await SubCategory.findById(subCategoryId);
    if (!existingSubCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    let parsedVariants;

    try {
      parsedVariants =
        typeof variants === "string" ? JSON.parse(variants) : variants;
    } catch (error) {
      return res.status(400).json({
        message: "Invalid variants format",
      });
    }

    if (!Array.isArray(parsedVariants)) {
      return res.status(400).json({
        message: "Variants should be an array",
      });
    }

    if (parsedVariants.length === 0) {
      return res.status(400).json({
        message: "At least one variant is required",
      });
    }

    const invalidVariant = parsedVariants.some((variant) => {
      return (
        !variant.ram?.trim() ||
        variant.price === undefined ||
        variant.price < 0 ||
        variant.quantity === undefined ||
        variant.quantity < 0
      );
    });

    if (invalidVariant) {
      return res.status(400).json({
        message: "Each variant must contain valid ram, price and quantity",
      });
    }

    const imageNames =
      req.files?.map((file) => `/uploads/products/${file.filename}`) || [];

    if (imageNames.length === 0) {
      return res.status(400).json({
        message: "At least one product image is required",
      });
    }
    const product = await Product.create({
      name,
      description,
      subCategoryId,
      variants: parsedVariants,
      images: imageNames,
    });
    return res
      .status(201)
      .json({ message: "Product created successfully", product });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { search, subCategoryId } = req.query;
    const skip = (page - 1) * limit;
    const filter = {};
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }
    if (subCategoryId) {
      if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
        return res.status(400).json({
          message: "Invalid subcategoryId format",
        });
      }

      filter.subCategoryId = subCategoryId;
    }
    const products = await Product.find(filter).skip(skip).limit(limit);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    return res.status(200).json({
      products,
      currentPage: page,
      totalPages,
      totalProducts,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid ProductId" });
    }
    const product = await Product.findById(productId).populate("subCategoryId");

    if (!product) {
      return res.status(404).json({ message: "Product Not found" });
    }
    return res
      .status(200)
      .json({ message: "Product fetched successfully", product });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const { name, description, subCategoryId, variants } = req.body;

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

    if (subCategoryId) {
      if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
        return res.status(400).json({
          message: "Invalid SubcategoryId",
        });
      }

      const existingSubCategory = await SubCategory.findById(subCategoryId);

      if (!existingSubCategory) {
        return res.status(404).json({
          message: "Subcategory not found",
        });
      }

      product.subCategoryId = subCategoryId;
    }

    if (variants) {
      let parsedVariants;

      try {
        parsedVariants =
          typeof variants === "string" ? JSON.parse(variants) : variants;
      } catch (error) {
        return res.status(400).json({
          message: "Invalid variants format",
        });
      }

      if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
        return res.status(400).json({
          message: "At least one variant is required",
        });
      }

      const invalidVariant = parsedVariants.some((variant) => {
        return (
          !variant.ram?.trim() ||
          variant.price === undefined ||
          variant.price < 0 ||
          variant.quantity === undefined ||
          variant.quantity < 0
        );
      });

      if (invalidVariant) {
        return res.status(400).json({
          message: "Each variant must contain valid ram, price and quantity",
        });
      }

      product.variants = parsedVariants;
    }

    if (name) {
      product.name = name.trim();
    }

    if (description) {
      product.description = description.trim();
    }

    if (req.files?.length > 0) {
      await Promise.all(
        product.images.map(async (image) => {
          try {
            const imagePath = path.join(process.cwd(), image);

            await fs.unlink(imagePath);
          } catch (error) {
            if (error.code !== "ENOENT") {
              throw error;
            }
          }
        }),
      );

      const imageNames = req.files.map(
        (file) => `/uploads/products/${file.filename}`,
      );

      product.images = imageNames;
    }

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export { createProduct, getProduct, getProductById, updateProduct };

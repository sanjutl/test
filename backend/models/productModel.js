import mongoose, { Schema } from "mongoose";

const varientSchema = new Schema({
  ram: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    variants: {
      type: [varientSchema],
      required: true,
    },
    images: [String],
  },
  { timestamps: true },
);

const Product = mongoose.model("Product",productSchema)
export default Product
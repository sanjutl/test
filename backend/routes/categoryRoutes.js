import { Router } from "express";
import { createCategory,getCategories } from "../controllers/categoryController.js";
import isUser from "../middleware/authMiddleware.js";

const categoryRouter=Router();

categoryRouter.route("/createCategory").post( isUser,createCategory)
categoryRouter.route("/getCategories").get(isUser,getCategories)

export default categoryRouter
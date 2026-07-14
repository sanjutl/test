import { Router } from "express";
import { createSubCategory ,getSubCategories} from "../controllers/subcategoryController.js";


const subcategoryRouter = Router()

subcategoryRouter.route("/createSubCategory").post(createSubCategory)
subcategoryRouter.route("/getSubCategory").get(getSubCategories)


export default subcategoryRouter
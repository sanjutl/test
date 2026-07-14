import { Router } from "express";
import { createProduct,getProduct,getProductById,updateProduct} from "../controllers/productController.js";
import { productMulter } from "../multer/multer.js";

const ProductRouter=Router()


ProductRouter.route("/createProduct").post(productMulter.array("images",5),createProduct)
ProductRouter.route("/getProduct").get(getProduct)
ProductRouter.route("/getProduct/:productId").get(getProductById)
ProductRouter.route("/updateProduct/:productId").patch(productMulter.array("images",5),updateProduct)




export default ProductRouter
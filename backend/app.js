import express from "express"
import cors from "cors"
import authRouter from "./routes/authRoutes.js"
import categoryRouter from "./routes/categoryRoutes.js"
import subcategoryRouter from "./routes/subcategoryRoute.js"
import ProductRouter from "./routes/productRoutes.js"
import WishlistRouter from "./routes/wishlistRoutes.js"
const app =express()
app.use(express.json())

app.use(
  cors({
    origin:"*"
  })
);


app.get('/',(req,res)=>{
    res.send("running")
})
app.use("/api/auth",authRouter)
app.use("/api/category",categoryRouter)
app.use("/api/subcategory",subcategoryRouter)
app.use("/api/product",ProductRouter)
app.use("/api/wishList",WishlistRouter)
app.use("/uploads", express.static("uploads"));
export default app
import Category from "../models/categoryModel.js";

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "name cannot be empty",
      });
    }
    const existingCategory=await Category.findOne({name})
    if(existingCategory){
         return res.status(400).json({
        message: "Category name is already present",
      });
    }

    const category=await Category.create({
        name
    })
    res.status(201).json({message:"Category created successfully",category})
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getCategories=async(req,res)=> {
    try {
        const categories= await Category.find().sort({createdAt:-1})
        return res.status(200).json({message:"Categories fetched successfully",categories})
    } catch (error) {
        return res.status(500).json({
      message: error.message,
    });
    }
}
export {createCategory,getCategories}
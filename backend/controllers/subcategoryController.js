import SubCategory from "../models/subCategoryModel.js";
import Category from "../models/categoryModel.js";

const createSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    if (!name || !categoryId) {
      return res.status(400).json({
        message: "Name and CategoryId are required",
      });
    }
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(400).json({
        message: "Invalid Category",
      });
    }
    const existingSubCategory = await SubCategory.findOne({
      name: name,
      categoryId,
    });

    if (existingSubCategory) {
      return res.status(409).json({
        message: "Subcategory already exists in this category",
      });
    }
    const subCategory = await SubCategory.create({
      name,
      categoryId,
    });
    return res.status(201).json({
      message: "Subcategory created successfully",
      subCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const getSubCategories= async(req,res)=>{
    try {
        const {categoryId}=req.query
        const filter={}

        if(categoryId){
            filter.categoryId=categoryId
        }
        const subcategory= await SubCategory.find(filter).populate("categoryId","name")
        return res.status(200).json({message:"Subacategories fetched successfully",subcategory})

    } catch (error) {
        return res.status(500).json({
      message: error.message,
    });
    }
}

export {createSubCategory,getSubCategories}
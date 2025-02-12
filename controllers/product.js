import Product from "../models/productModel.js";

const getProductsByCategoryId = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const products = await Product.find({ category: categoryId });
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this category",
      });
    }
    res.status(200).json({
      success: true,
      products, //yaha jo bhi products mil rhe hai boh
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve categories",
      error: err.message,
    });
  }
};

export { getProductsByCategoryId };

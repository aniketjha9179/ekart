import dotenv from "dotenv"
import mongoose,{Types} from "mongoose";
import Product from "./models/productModel.js";
import Category from "./models/CategoryModel.js";
import { categoriesData,productData } from "./seedData.js";



dotenv.config();
async function seedDatabase() {
    try {
 await mongoose.connect(process.env.MONGODB_URI)
//  deleting the existing data
   await Product.deleteMany({});
   await Category.deleteMany({})

const categoryDocs  = await Category.insertMany(categoriesData);
const categoryMap=  categoryDocs.map((map,category)=>{
    map[category.name]= category._id;
    return map
})
const productWithCategoryIds= productData.map((product)=>({
    ...product,
    category:categoryMap[product.category]
}))

await Product.insertMany(productWithCategoryIds)

        
    } catch (error) {
       console.error("Error Seeding database",error);
        
    }
    finally{
        mongoose.connection.close()
    }
}

seedDatabase()
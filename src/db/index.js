import sequelize from "./models/index.js";
import Product from "./models/productModel.js";
import Review from "./models/reviewModel.js";
import Category from "./models/categoryModel.js"
import Cart from "./models/cartModel.js"

Product.hasMany(Review)
Review.belongsTo(Product)

Category.hasMany(Product)
Product.belongsTo(Category)

Product.hasMany(Cart)
Cart.belongsTo(Product)

export { sequelize, Product, Review, Category, Cart }
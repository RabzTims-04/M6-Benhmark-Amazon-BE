import express from "express"
import { Cart, Product } from "../../db/index.js"
import sequelize from "sequelize"
import createError from 'http-errors'
import { queryFilter } from "../../lib/query/query.js"

const { Op } = sequelize
const cartRouter = express.Router()

/* ***************cart********************* */

cartRouter.route("/")
.post( async (req, res, next) => {
    try {
        const data = await Cart.create(req.body)
        res.send(data)
    } catch (error) {
        console.log(error);
        next(error)
    }
})
.get( async (req, res, next) => {
    try {    
        const groupAndIcludeProduct = await Cart.findAll({
          attributes: [
            "productId",
            [sequelize.fn("COUNT", "id"), "quantity"],
            [sequelize.fn("SUM", sequelize.col("product.price")), "total"],
          ],
          
          include: { model: Product, attributes: ["name", "price", "imageUrl", "description", "brand"] },
          group: ["productId", "product.id"],
        });
    
        const countAll = await Cart.count({
        });

        const sumAll = await Cart.sum("product.price", {
          include: { model: Product, attributes: [] },
        });

        res.send({ 
            products: groupAndIcludeProduct, 
            total: countAll,
            totalPrice: sumAll
        })
    
      } catch (error) {
        console.log(error);
        next(error);
      }
})
.delete( async (req, res, next) => {
    try {
        const rowsCount = await Cart.destroy({
            where:{}
        })
        res.send("deleted")
    } catch (error) {
        console.log(error);
        next(error)
    }
})

cartRouter.route("/:prodId")
.delete ( async (req, res, next) => {
    try {
        const rowsCount = await Cart.destroy({
            where: {
                productId: req.params.prodId
            },
            limit: !req.query.all && 1
        })
        console.log(rowsCount);
        if(rowsCount > 1){
            res.send('product removed from cart')
        }
        else if(rowsCount === 1){
            res.send("qty decreased")
        }
        else{
            res.send("error while deleting")
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
})

export default cartRouter

import express from "express"
import { Review } from "../../db/index.js"
import sequelize from "sequelize"
import createError from 'http-errors'
import { queryFilter } from "../../lib/query/query.js"

const { Op } = sequelize
const reviewsRouter = express.Router()

/* ***************reviews********************* */

reviewsRouter.route("/")
.get( async (req, res, next) => {
    try {
        const data = await Review.findAll()
        res.send(data)
    } catch (error) {
        console.log(error);
        next(error)
    }
})
.post( async (req, res, next) => {
    try {
        const data = await Review.create(req.body)
        res.send(data)
    } catch (error) {
        console.log(error);
        next(error)
    }
})

/* reviewsRouter.route("/blogs/:blogId")
.get( async (req, res, next) => {
    try {
        const data = await Review.findAll({
            where: {
                blogId: req.params.blogId
            },
            include: [{
                model: Author,
                attributes: ["name", "surname"]}]
        })
        res.send(data)
    } catch (error) {
        console.log(error);
        next(error) 
    }
}) */
/* 
reviewsRouter.route("/authors/:authorId")
.get( async (req, res, next) => {
    try {
        const data = await Review.findAll({
            where: {
                authorId: req.params.authorId
            },
            include: [{
                model: Author,
                attributes: ["name", "surname"]},
                {model: Blog,
                attributes: ["category", "title", "content"]
            }]
        })
        res.send(data)
    } catch (error) {
        console.log(error);
        next(error) 
    }
}) */

/* reviewsRouter.route("/:authorId/:blogId")
.get( async (req, res, next) => {
    try {
       const blogData = await Review.findAll({
           where: {
               blogId: req.params.blogId,
               authorId: req.params.authorId
           }
       })

       const groupBy = await Review.findAll({
        where: {
            blogId: req.params.blogId,
            authorId: req.params.authorId
        },
        include: [{
            model: Author,
            attributes: ["name", "surname"]},
            {model: Blog,
            attributes: ["category", "title", "content"]
        }]
       })
       res.send(groupBy)
    } catch (error) {
        console.log(error);
        next(error)
    }
}) */

reviewsRouter.route("/:id")
.put( async (req, res, next) => {
    try {
        const data = await Review.update(req.body, {
            where: {
              id: req.params.id,
            },
            returning: true,
          });
          res.send(data[1][0]);
    } catch (error) {
        console.log(error);
        next(error)
    }
})
.delete ( async (req, res, next) => {
    try {
        const rowsCount = await Review.destroy({
            where: {
              id: req.params.id,
            },
          });
          if (rowsCount > 0) {
            res.send("deleted successfully");
          } else {
            res.send("error while deleting");
          }
    } catch (error) {
        console.log(error);
        next(error)
    }
})

export default reviewsRouter

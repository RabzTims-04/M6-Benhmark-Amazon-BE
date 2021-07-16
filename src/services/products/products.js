import express from "express";
import sequelize from "sequelize";
import { Product, Category, Review } from "../../db/index.js";
import createError from "http-errors";
import axios from "axios";
import { pipeline } from "stream";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { generatePDFReadableStream, stream2Buffer } from "../../lib/pdf/index.js";

const { Op } = sequelize;
const productsRouter = express.Router();

/* ***************products********************* */

productsRouter
  .route("/")
  .get(async (req, res, next) => {
    try {

      const data = await Product.findAll({
        include:[
          {
            as: "category",
            model: Category,
            attributes: ["name", ["id", "categoryId"]],
            where: req.query.category
              ? { name: { [Op.iLike]: `%${req.query.category}%` } }
              : {},
          },
          {
            model: Review,
            attributes: ["comment", "rate", ["id", "reviewId"]]
          }
        ],
        /* include: [
          {
            model: Author,
            where: req.query.author
              ? {[Op.or] : [{ name : { [Op.iLike]: `%${req.query.author}%`}} , { surname : { [Op.iLike]: `%${req.query.author}%`}}]}
              :{}
          },
          {
            as: "category",
            model: Category,
            attributes: ["name", ["id", "categoryId"]],
            where: req.query.category
              ? { name: { [Op.iLike]: `%${req.query.category}%` } }
              : {},
          },
          {
            model: Comment,
            attributes: ["text", ["id", "commentId"]],
            include: [
              {
                model: Author,
                attributes: ["name", "surname", "avatar", ["id", "authorId"]],
              },
            ],
          },
        ],
        where: req.query.title 
            ? {title: { [Op.iLike]: `%${req.query.title}%`}} 
            : {} */
        where: req.query.name 
            ? {name: { [Op.iLike]: `%${req.query.name}%`}} 
            : {}
      });
      res.send(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const data = await Product.create(req.body);
      res.send(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

/* productsRouter.route("/author").get(async (req, res, next) => {
  try {
    const data = await Author.findAll({
      include: [{ model: Product }],
    });
    res.send(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
 */
/* productsRouter.route("/author/:authorId").get(async (req, res, next) => {
  try {
    const data = await Author.findByPk(req.params.authorId, {
      include: [{ model: Product }],
    });
    res.send(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
}); */

productsRouter
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const data = await Product.findOne({
        where:{
          id: req.params.id
        },
        include:[
          {
            as: "category",
            model: Category,
            attributes: ["name", ["id", "categoryId"]]
          },
          {
            model: Review,
            attributes: ["comment", "rate", ["id", "reviewId"]]
          }
        ],
      })
      res.send(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  })
  .put(async (req, res, next) => {
    try {
      const data = await Product.update(req.body, {
        where: {
          id: req.params.id,
        },
        returning: true,
      });
      res.send(data[1][0]);
    } catch (error) {
      console.log(error);
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const rowsCount = await Product.destroy({
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
      next(error);
    }
  });

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
  },
});

const uploadOnCloudinary = multer({ storage: cloudinaryStorage }).single(
  "cover"
);

productsRouter
  .route("/:productId/upload")
  .post(uploadOnCloudinary, async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const newCover = { cover: req.file.path };
      const url = newCover.cover;
      console.log(url);
      const product = await Product.findByPk(productId);
      console.log(url);
      if (product) {
        product.imageUrl = url;
        const coverData = await Product.update(
          { imageUrl: url },
          {
            where: {
              id: productId,
            },
            returning: true,
          }
        );
        console.log(coverData);

        res.send(coverData[1][0]);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

/* productsRouter.route("/:ProductId/pdf").get(async (req, res, next) => {
  try {
    const ProductId = req.params.ProductId;
    const Product = await Product.findByPk(ProductId);
    console.log(Product);
    if (Product) {
      const authorObj = await Author.findByPk(Product.authorId);
      console.log(authorObj);
      console.log(Product.cover);
      const response = await axios.get(Product.cover, {
        responseType: "arraybuffer",
      });
      const mediaPath = Product.cover.split("/");
      const filename = mediaPath[mediaPath.length - 1];
      const [id, extension] = filename.split(".");
      const base64 = Buffer.from(response.data).toString("base64");
      const base64Image = `data:image/${extension};base64,${base64}`;
      const source = generatePDFReadableStream(Product, base64Image, authorObj);
      const destination = res;
      pipeline(source, destination, (err) => {
        if (err) {
          next(err);
        }
      });
    } else {
      next(createError(404, `Product with id: ${ProductId} not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}); */

export default productsRouter;

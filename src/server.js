import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import { notFoundErrorHandler, badRequestErrorHandler, catchAllErrorHandler } from "./errorMiddlewares.js";
import { sequelize } from "./db/index.js";
import productsRouter from "./services/products/products.js";
import reviewsRouter from "./services/reviews/reviews.js";
import categoriesRouter from "./services/categories/categories.js";

const server = express()
const port = 3001 || process.env.PORT

// ****************** MIDDLEWARES ****************************

server.use(cors())
server.use(express.json())

// ****************** ROUTES *******************************

server.use("/products", productsRouter)
server.use("/reviews", reviewsRouter)
server.use("/categories", categoriesRouter)

// ****************** ERROR HANDLERS ***********************

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(catchAllErrorHandler)

console.table(listEndpoints(server));

sequelize
    .sync({alter:true})
        .then(() => {
            server.listen(port, () => console.log("🧡 server is running on port ", port))
            server.on("error", (error) => console.log(`💔 server is crashed sue to ${error}`))
        })
            .catch((err) => {
                console.log(err);
            })
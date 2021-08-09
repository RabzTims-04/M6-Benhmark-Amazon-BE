import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import { notFoundErrorHandler, badRequestErrorHandler, catchAllErrorHandler } from "./errorMiddlewares.js";
import { sequelize } from "./db/index.js";
import productsRouter from "./services/products/products.js";
import reviewsRouter from "./services/reviews/reviews.js";
import categoriesRouter from "./services/categories/categories.js";
import cartRouter from "./services/cart/cart.js";

const server = express()
const port = process.env.PORT || 3002 
// ****************** MIDDLEWARES ****************************

server.use(cors())
server.use(express.json())

// ****************** ROUTES *******************************

server.use("/products", productsRouter)
server.use("/reviews", reviewsRouter)
server.use("/categories", categoriesRouter)
server.use("/cart", cartRouter)

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

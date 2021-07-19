import sequelize from "./index.js";
import s from "sequelize"
const { DataTypes } = s

const Product = sequelize.define('product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price:{
        type: DataTypes.FLOAT(4,2),
        allowNull:false
    }
})

export default Product
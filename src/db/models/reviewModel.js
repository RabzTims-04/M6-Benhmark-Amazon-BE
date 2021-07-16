import sequelize from "./index.js";
import s from "sequelize"
const { DataTypes } = s

const Review = sequelize.define('review', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    comment:{
        type: DataTypes.TEXT,
        allowNull: false,
    },
    rate:{
        type: DataTypes.INTEGER,
        allowNull:false,
        validate:{
            min:1,
            max:5
        }
    }
})

export default Review
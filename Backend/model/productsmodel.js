const mongoose = require("mongoose")

const ProductsSchema = new mongoose.Schema({

    title:{
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    category:{
        type: String,
        required: true
    },

    image:{
        type: String,
        required: true
    },

    rating: {
        rate: {
            type: Number,
            required: true
        },
        count: {
            type: Number,
            required: true
        }
    },

    sale:{
        type: String,
    },

    salepercentage:{
        type: Number
    }

}, {collection: "products"})

const Products = mongoose.model("Products", ProductsSchema)

module.exports = Products
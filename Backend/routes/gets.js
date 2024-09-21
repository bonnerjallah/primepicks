const Products = require("../model/productsmodel")

const getAllProducts = async (req, res) => {
    try {

        const result = await Products.find().exec()

        return res.json(result)
        
    } catch (error) {
        console.log("Error fetching data from database", error)
        return res.status(500).json({message: "Internal server issue"})
    }
}

module.exports = {getAllProducts}
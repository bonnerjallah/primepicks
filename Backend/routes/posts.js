const Products = require("../model/productsmodel")
const path = require("path")

const addNewProduct = async (req, res) => {
    try {

        console.log("data recieved", req.body)
        
        const {title, price, description, category, rating, count} = req.body;
        const image = req.file ? path.basename(req.file.path) : "";

        if (!title || !price || !description || !category || !rating || !count) {
            return res.status(400).json({ message: "All fields are required" }); 
        }

        const results = await Products.create({
            title,
            price,
            description,
            category,
            rating:{
                rate: Number(rating),
                count: Number(count)
            },
            image
        })

        res.json(results)

        
    } catch (error) {
        console.log("Error inserting data", error)
        return res.status(500).json({message: "Internal server issue"})
    }

}

module.exports = {addNewProduct}


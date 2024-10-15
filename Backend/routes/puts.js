const Products = require("../model/productsmodel")
const path = require("path")
const fs = require("fs")

const editProduct = async (req, res) => {
    try {
        console.log("data received", req.body)
        console.log("filename", req.file)
        
        const {id, category, description, price, rating, salepercentage, title, sale } = req.body
        const imageToEdit = req.file ? path.basename(req.file.path) : ""

        const itemToEdit = await Products.findById(id)

        if(!itemToEdit) {
            console.log("No item match")
            return res.status(404).json({message: "No item matches"})
        }

        itemToEdit.category = category || itemToEdit.category;
        itemToEdit.description = description || itemToEdit.description;
        itemToEdit.price = price || itemToEdit.price;
        itemToEdit.salepercentage = salepercentage || itemToEdit.salepercentage
        itemToEdit.title = title || itemToEdit.title;
        itemToEdit.sale = sale 
        itemToEdit.rating.count = rating.count || itemToEdit.rating.count;
        itemToEdit.rating.rate = rating.rate || itemToEdit.rating.rate;

        if(imageToEdit) {
            if(itemToEdit.image && itemToEdit.image !== "") {
                const previousImage = path.join(__dirname, "../../shared-folder/productimages", itemToEdit.image)

                if (fs.existsSync(previousImage)) {
                    try {
                        fs.unlink(previousImage, (err) => {
                            if(err){
                                console.log("Error deleting previous item image", err)
                            } else {
                                console.log("Previous item image deleted successfully")
                            }
                        })
                    } catch (error) {
                        console.log("Error deleting previous item image", error)
                    }
                } else {
                    console.log("Previous item Image not found, skipping deletion")
                }
            } 

            itemToEdit.image = imageToEdit

        }

        await itemToEdit.save()

        return res.status(200).json(itemToEdit);

    } catch (error) {
        console.log("Error editing data", error)
        return res.status(500).json({message: "Internal server issue"})
    }
}

module.exports = {editProduct}
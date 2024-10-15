const Products = require("../model/productsmodel")
const path = require("path")
const fs = require("fs")

const deleteItem = async (req, res) =>   {
    try {
        const {id} = req.params;

        const itemToDelete = await Products.findById(id)

        if(!itemToDelete) {
            return res.status(404).json({message: "Item not found"})
        }


        if(itemToDelete) {
            if(typeof itemToDelete.image === "string") {
                const itemImage = path.join(__dirname, '../../shared-folder/productimages', itemToDelete.image)

                if (fs.existsSync(itemImage)) {
                    try {
                        await fs.promises.unlink(itemImage)
                        console.log("Item image deleted successfully")
                        
                    } catch (error) {
                        console.log("error deleting item image", error)
                    }
                }
            } else {
                console.log("Image file not found, skipping deletion")
            }
        }

        await Products.findByIdAndDelete(id)

        return res.status(200).json({message: "Deleted item successfully"})
        
    } catch (error) {
        console.log("error deleting data", error)
        return res.status(500).json({message: "Internal server issue"})
    }

}

module.exports = {deleteItem}
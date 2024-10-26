const Products = require("../model/productsmodel")
const PurchaseOrder = require("../model/purchaseordermodel") 
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

const orders = async (req, res) => {
    try {
        const {filterCartItems, firstname, lastname, address, aptnumber, city, state, zipcode, email, phonenumber, shipMtd, emailme, grandTotalAmount} = req.body

        const item = filterCartItems.map((elem) => ({
            id: elem._id,
            price: parseFloat(elem.price.replace(/,/g, "")),
            quantity: parseFloat(elem.quantity)
        }))

        const total = parseFloat(grandTotalAmount.replace(/,/g, ""))
        const trackingNumber = `${Date.now()}-${Math.floor(Math.random() * 1000)}`

        const result = await PurchaseOrder.create({
            item: item,
            contact: {
                firstname,
                lastname,
                phonenumber,
                email,
                address: {
                    streetname: address,
                    apt: aptnumber,
                    zipcode,
                    city,
                    state,
                }
            },
            emailme,
            shippingmethod: shipMtd,
            grandtotal: total,
            ordertrackingnumber: trackingNumber
        });

        res.json(result);
        
    } catch (error) {
        console.log("Error inserting order data", error)
        return res.status(500).json({message: "Internal server issue"})
    }
}



module.exports = {addNewProduct, orders}


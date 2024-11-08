const Products = require("../model/productsmodel")
const Member = require("../model/customermodel")
const PurchaseOrder = require("../model/purchaseordermodel")

const getAllProducts = async (req, res) => {
    try {

        const result = await Products.find().exec()

        return res.json(result)
        
    } catch (error) {
        console.log("Error fetching data from database", error)
        return res.status(500).json({message: "Internal server issue"})
    }
}

const getallSubscribedMember = async (req, res) => {
    try {

        const result = await Member.find().select("firstname lastname email")

        return res.status(200).json(result)
        
    } catch (error) {
        console.log("Error fetching all members", error)
        return res.status(500).json({message: "Internal server issue"})
    }
}

const getOrders = async (req, res) => {
    try {
        
        const result = await PurchaseOrder.find().exec()

        return res.status(200).json(result)
        
    } catch (error) {
        console.log("Error fetching orders", error)
        return res.status(500).json({message: "Internal server issue"})
    }
}



module.exports = {getAllProducts, getallSubscribedMember, getOrders}
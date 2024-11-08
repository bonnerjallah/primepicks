const mongoose = require("mongoose")

const AdminUserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    username: {
        type: String, 
        required: true
    },

    pwd: {
        type: String,
        required: true
    },

    profilepic: {
        type: String,
    }
    
}, {collection: "AdminUser"})

const AdminUser = mongoose.model("AdminUser", AdminUserSchema)

module.exports = AdminUser
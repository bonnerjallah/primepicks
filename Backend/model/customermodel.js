const mongoose = require("mongoose")

const MemberSchema = new mongoose.Schema({

    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    pwd: {
        type: String,
        required: true
    }

}, {collection: "member"})

const Member = mongoose.model("Member", MemberSchema)

module.exports = Member
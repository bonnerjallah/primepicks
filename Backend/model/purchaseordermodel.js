const mongoose = require("mongoose");

const PurchaseOrderSchema = new mongoose.Schema({
    item: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        }
    }],
    
    contact: {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        phonenumber: {
            type: String
        },
        email: {
            type: String,
            required: true
        },
        address: {
            streetname: {
                type: String,
                required: true
            },
            apt: {
                type: String,
            },
            zipcode: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            }
        },
    },

    shippingmethod: {
        type: String,
        enum: ['Economy', 'usps', 'ups'],
        required: true
    },

    grandtotal: {
        type: Number,
        required: true
    },

    paymentstatus: {
        type: String,
        enum: ['pending', 'paid', 'rejected'],
        default: 'pending'
    },
    
    orderstatus: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },

    ordertrackingnumber: {
        type: String,
        unique: true
    },

    emailme: {
        type: Boolean
    }

}, { collection: "PurchaseOrder", timestamps: true });

const PurchaseOrder = mongoose.model("PurchaseOrder", PurchaseOrderSchema);

module.exports = PurchaseOrder;

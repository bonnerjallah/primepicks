const mongoose = require("mongoose")

const connectDB = async () => {
    try {   
        
        await mongoose.connect(process.env.VITE_URI, {dbName: "primepicks"})

        console.log("primepicks mongodb connected")

    } catch (error) {
        console.error("Error connecting to data base", error)
    }

}

module.exports = connectDB
require('dotenv').config();
const express = require("express")
const cors = require("cors")


const connectDB = require("./config/db")
const router = require("./routes/router")
const cookieParser = require("cookie-parser")

const ADMIN_FRONTEND_URL = process.env.ADMIN_FRONTEND_URL
const CLIENT_FRONTEND_URL = process.env.CLIENT_FRONTEND_URL
const PORT = process.env.VITE_PORT || 3001


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

const corsOptions = {
    origin: [ADMIN_FRONTEND_URL, CLIENT_FRONTEND_URL], // Array of origins
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
};

// Apply the CORS middleware globally
app.use(cors(corsOptions));

connectDB()




app.use("/", router)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
require('dotenv').config();
const express = require("express")
const cors = require("cors")


const connectDB = require("./config/db")
const router = require("./routes/router")
const cookieParser = require("cookie-parser")

const PORT = process.env.PORT || 3001
const allowedOrigins = [
    process.env.ADMIN_FRONTEND_URL, 
    process.env.CLIENT_FRONTEND_URL 
];

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow the request
        } else {
            callback(new Error("Not allowed by CORS")); // Error for disallowed origins
        }
    },
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}))

connectDB()




app.use("/", router)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
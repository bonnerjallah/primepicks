require('dotenv').config();
const express = require("express")
const cors = require("cors")


const connectDB = require("./config/db")
const router = require("./routes/router")
const cookieParser = require("cookie-parser")

const PORT = process.env.PORT || 3001

const corsAdmin = cors({
    origin: process.env.ADMIN_FRONTEND_URL,
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
});

const corsClient = cors({
    origin: process.env.CLIENT_FRONTEND_URL,
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
});


const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Apply CORS for admin routes
app.use('/admin', corsAdmin);

// Apply CORS for client routes
app.use('/client', corsClient);


connectDB()




app.use("/", router)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
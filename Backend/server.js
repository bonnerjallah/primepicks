const express = require("express")
const cors = require("cors")

const connectDB = require("./config/db")
const router = require("./routes/router")
const cookieParser = require("cookie-parser")

const frontEndUrl = process.env.VITE_FRONTEND_URL
const PORT = process.env.VITE_PORT || 3001


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use(cors({
    origin: `${frontEndUrl}`,
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}))

connectDB()


app.use("/", router)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
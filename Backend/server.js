const express = require("express")
const cors = require("cors")

const connectDB = require("./config/db")
const router = require("./routes/router")


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}))

connectDB()



app.use("/", router)

app.listen(3001, () => {
    console.log("listing on port 3001")
})
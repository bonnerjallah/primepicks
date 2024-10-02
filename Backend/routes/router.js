const express = require("express")
const multer = require("multer")
const path = require("path")


const {addNewProduct} = require("./posts")
const {getAllProducts} = require("./gets")
const {register, login, validateAccessToken, refreshToken, getMember, logOut} = require("../controllers/controller")


const router = express.Router();

router.use(express.json())
router.use(express.urlencoded({extended: true}))

router.use("/productimages", express.static(path.join(__dirname, "../../shared-folder/productimages")))


const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, path.join(__dirname, "../../shared-folder/productimages"))
    },
    filename:(req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: {fileSize:5000000},
    fileFilter: (req, file, cb) => {
        const fileType = /jpeg|jpg|png|jfif|webp/i;
        const mimeType = fileType.test(file.mimetype)
        const extname = fileType.test(path.extname(file.originalname))    

        if(mimeType && extname) {
            return cb(null, true)
        }

        cb(new Error("Give proper file format to upload"))
    }
})


router.post("/addproduct", upload.single("image"), addNewProduct)

router.get("/getallproducts", getAllProducts)

router.post("/register", register)

router.post("/loginmember", login)

router.post("/refresh_token", refreshToken)

router.post("/getmember", getMember, validateAccessToken)

router.post("/logout", logOut)


module.exports = router;
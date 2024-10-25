const express = require("express")
const multer = require("multer")
const path = require("path")


const {addNewProduct, orders} = require("./posts")
const {getAllProducts, getallSubscribedMember, getOrders} = require("./gets")
const {editProduct, orderShipped} = require("./puts")
const {deleteItem} = require("./deletes")
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


router.get("/getallproducts", getAllProducts)
router.get("/getmember", validateAccessToken, getMember)
router.get("/getallsubscribedmembers", getallSubscribedMember)
router.get("/getorders", getOrders)


router.post("/addproduct", upload.single("image"), addNewProduct)
router.post("/register", register)
router.post("/loginmember", login)
router.post("/refresh_token", refreshToken)
router.post("/logout", logOut)
router.post("/purchaseorders", orders )

router.put("/editproduct", upload.single("editedImage"), editProduct)
router.put("/shiporder/:id", orderShipped)

router.delete("/deleteitem/:id", deleteItem)


module.exports = router;
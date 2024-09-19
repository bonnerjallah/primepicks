const express = require("express")


const router = express.Router();

router.get("/", (req, res) => {
    res.send("hello form the back end. PAUSE!!")
})


module.exports = router;
const bcrypt = require('bcryptjs')
const saltRounds = 10;

const jwt = require("jsonwebtoken")

const jwtSec = process.env.VITE_jwtSecret
const refToken = process.env.VITE_jwtRefreshSecret

const Member = require("../model/customermodel")

const register = async(req, res) => {
    try {
        const { firstname, lastname, email, pwd } = req.body;
        console.log("data", req.body);

        if (!firstname || !lastname || !email || !pwd) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }

        const existingUser = await Member.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashPwd = await bcrypt.hash(pwd, saltRounds);

        const newMember = await Member.create({ ...req.body, pwd: hashPwd });

        return res.json({
            _id: newMember._id,
            firstname: newMember.firstname,
        });

    } catch (error) {
        console.error("Error inserting data", error);
        return res.status(500).json({ message: "Internal server issue" });
    }
};

const login = async (req, res) => {
    try {
        const {email, pwd} = req.body

        if(!email || !pwd) {
            return res.status(400).json({message: "All fields require"})
        }

        const user = await Member.findOne({email})

        if(user) {
            const hashedPassword = user.pwd
            const passwordMatch = await bcrypt.compare(pwd, hashedPassword)

            if(passwordMatch) {
                const userData = {
                    _id: user._id,
                    firstname: user.firstname
                }

                const accessToken = jwt.sign({user:userData}, jwtSec, {expiresIn: "5min"})
                const refresh_token = jwt.sign({user:userData}, refToken, {expiresIn: "1hr"})

                res.cookie("token", accessToken, {httpOnly: true, sameSite: "None", secure: process.env.NODE_ENV === "production"})
                res.cookie("refreshToken", refresh_token, {httpOnly: true, sameSite: "None", secure: process.env.NODE_ENV === "production"})

                return res.status(200).json({
                    message: "Login Successfully",
                    userData: userData
                })

            } else {
                return res.status(401).json({message: "Invalid Password"})
            }

        } else {
            return res.status(400).json({message: "Invalid Username"})
        }

    } catch (error) {
        console.log("Error login in user", error)
        return res.status(500).json({message: "Internal server issue"})
    }
}

const validateAccessToken = (req, res, next) => {
    const accessToken = req.cookies.token;

    if(!accessToken) {
        return res.status(401).json({error: "Access token is missing"})
    }

    jwt.verify(accessToken, jwtSec, (err, decoded) => {
        if(err) {
            console.log("Error verifying access token", err);
            return res.status(401).json({error: "Invalid access token"})
        }

        req.user = decoded.user
        next()
    })
}

const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) {
        return res.status(401).json({error: "Refresh token missing"})
    }

    jwt.verify(refreshToken, refToken, (err, decoded) => {
        if(err) {
            console.log("Refresh token error:", err)
            return res.status(401).json({error: "Invalid or expired refresh token"})
        }

        const userData = decoded.user;

        const newAccessToken = jwt.sign({user: userData}, refToken, {expiresIn: "5min"});

        res.cookie("token", newAccessToken, { httpOnly: true, sameSite: "None", secure: process.env.NODE_ENV === "production" });

        res.status(200).json({message: "Token refresh successfully"})
    })
}

const getMember = (req, res) => {
    try {
        if(req.user) {
            return res.json({valid: true, user: req.user})
        } else {
            console.error("Token validation failed")
            return res.status(401).json({valid: false, error: "Unathorized user"})
        }
        
    } catch (error) {
        console.log("Error fetching user data", error)
        return res.status(500).json({message: "Internal server issue"})
    }
}

const logOut = (req, res) => {
    res.clearCookie("token", {httpOnly: true, sameSite: "None", secure:true})
    res.clearCookie("refreshToken", {httpOnly: true, sameSite: "None", secure: true})

    res.status(200).json({message: "Logged out successfully"})
}

module.exports = {register, login, validateAccessToken, refreshToken, getMember, logOut}
const bcrypt = require('bcryptjs')
const saltRounds = 10;

const jwt = require("jsonwebtoken")

const jwtSec = process.env.VITE_jwtSecret
const refToken = process.env.VITE_jwtRefreshSecret
const adminJwtSec = process.env.VITE_adminJwtSecret
const adminRefToken = process.env.VITE_adminJwtRefreshSecret

const Member = require("../model/customermodel")
const AdminUser = require("../model/adminusermodel")

// Function to verify refresh tokens
const verifyRefreshToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

// Register new member
const register = async(req, res) => {
    try {
        const { firstname, lastname, email, pwd } = req.body;

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

//login member
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

                res.cookie("memberToken", accessToken);
                res.cookie("refreshMemberToken", refresh_token, { httpOnly: true });

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

// Refresh token for clients
const refreshClientToken = async (req, res) => {
    const refreshToken = req.cookies.refreshMemberToken;

    if (!refreshToken) {
        return res.status(401).json({ error: "Client refresh token missing" });
    }

    try {
        const decoded = await verifyRefreshToken(refreshToken, refToken);
        const userData = decoded.user;

        const newAccessToken = jwt.sign({ user: userData }, jwtSec, { expiresIn: "5min" });
        res.cookie("memberToken", newAccessToken, { httpOnly: true });

        return res.status(200).json({message: "Client token refreshed successfully" });
    } catch (err) {
        console.log("Client refresh token error:", err);
        return res.status(401).json({ error: "Invalid or expired client refresh token" });
    }
};

// Validate access token for members
const validateAccessToken = (req, res, next) => {
    const accessToken = req.cookies.memberToken;

    if (!accessToken) {
        console.log("Access token is missing");
        return res.status(401).json({ error: "Access token is missing" });
    }

    jwt.verify(accessToken, jwtSec, (err, decoded) => {
        if (err) {
            console.log("Error verifying access token: ", err);
            return res.status(401).json({ error: "Invalid access token" });
        }

        req.user = decoded.user;
        next();
    });
};

const getMember = (req, res) => {
    try {
        if (req.user) {
            return res.json({ valid: true, user: req.user });
        } else {
            console.error("Token validation failed");
            return res.status(401).json({ valid: false, error: "Unauthorized user" });
        }
    } catch (error) {
        console.log("Error fetching user data:", error);
        return res.status(500).json({ message: "Internal server issue" });
    }
};

// Logout member
const logOut = (req, res) => {
    res.clearCookie("memberToken", { httpOnly: true, sameSite: "None", secure: true });
    res.clearCookie("refreshMemberToken", { httpOnly: true, sameSite: "None", secure: true });

    res.status(200).json({ message: "Logged out successfully" });
};

const adminuserregister = async(req, res) => {
    try {
        const {firstname, lastname, username, pwd} = req.body

        if(!firstname || !lastname || !username || !pwd) {
            return res.status(400).json({message: "All field required"})
        }

        const existingUser = await AdminUser.findOne({username});
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashPwd = await bcrypt.hash(pwd, saltRounds);

        const newAdminMenber = await AdminUser.create({...req.body, pwd: hashPwd})

        return res.json({
            _id: newAdminMenber._id,
            username: newAdminMenber.username
        })

    } catch (error) {
        console.log("Error registering user", error)
        return res.status(500).json({message: "Internal server issue"})
    }
}

const adminLogin = async (req, res) => {
    try {
        const { username, pwd } = req.body;
        if (!username || !pwd) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await AdminUser.findOne({ username });

        if (user) {
            const hashPwd = user.pwd;
            const passwordMatch = await bcrypt.compare(pwd, hashPwd);


            if (passwordMatch) {
                const userData = {
                    _id: user.id,
                    firstname: user.firstname,
                    username: user.username,
                };

                const accessToken = jwt.sign({ user: userData }, adminJwtSec, { expiresIn: "5min" });
                const refresh_token = jwt.sign({ user: userData }, adminRefToken, { expiresIn: "1hr" });

                res.cookie("adminToken", accessToken);
                res.cookie("refreshAdminToken", refresh_token, { httpOnly: true });

                return res.status(200).json({ message: "Login successfull", userData });
            } else {
                return res.status(401).json({ message: "Invalid password" });
            }
        } else {
            return res.status(400).json({ message: "Invalid username" });
        }

    } catch (error) {
        console.error("Error logging in user", error);
        return res.status(500).json({ message: "Internal server issue" });
    }
};

// Refresh token for admins
const refreshAdminToken = async (req, res) => {
    const refreshToken = req.cookies.refreshAdminToken;
    console.log("refr", refreshToken)

    if (!refreshToken) {
        return res.status(401).json({ error: "Admin refresh token missing" });
    }

    try {
        const decoded = await verifyRefreshToken(refreshToken, adminRefToken); // Use adminRefToken here
        const userData = decoded.user;

        const newAccessToken = jwt.sign({ user: userData }, adminJwtSec, { expiresIn: "5min" });
        res.cookie("adminToken", newAccessToken, { httpOnly: true });

        // Send back both userData and the new access token
        return res.status(200).json({ userData, accessToken: newAccessToken });    
    } catch (err) {
        console.log("Admin refresh token error:", err);
        return res.status(401).json({ error: "Invalid or expired admin refresh token" });
    }
};

// Validate admin access token
const validateAdminAccessToken = (req, res, next) => {
    const accessToken = req.cookies.adminToken;

    if (!accessToken) {
        console.log("Access token is missing");
        return res.status(401).json({ error: "Access token is missing" });
    }

    jwt.verify(accessToken, adminJwtSec, (err, decoded) => {
        if (err) {
            console.log("Error verifying access token: ", err);
            return res.status(401).json({ error: "Invalid access token" });
        }

        req.user = decoded.user;
        next();
    });
};

const getAdminMember = (req, res) => {
    try {
        if (req.user) {
            console.log("requser", req.user)
            return res.json({ valid: true, user: req.user });
        } else {
            console.error("Token validation failed");
            return res.status(401).json({ valid: false, error: "Unauthorized user" });
        }
    } catch (error) {
        console.error("Error fetching admin user:", error);
        return res.status(500).json({ message: "Internal server issue" });
    }
};


const adminLogOut = (req, res) => {
    res.clearCookie("adminToken", {httpOnly: true, sameSite: "None", secure: true})
    res.clearCookie("refreshAdminToken", {httpOnly: true, sameSite: "None", secure: true})

    res.status(200).json({messane: "Logged out successfully"})
}



module.exports = {register, login, validateAccessToken, refreshClientToken, getMember, logOut, adminuserregister, adminLogin, getAdminMember, validateAdminAccessToken, refreshAdminToken, adminLogOut}
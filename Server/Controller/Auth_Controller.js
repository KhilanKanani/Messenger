const generateToken = require("../Config/Generate_Token");
const User = require("../Model/User_Model");

const SignUp = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        const checkUserByUserName = await User.findOne({ userName })
        if (checkUserByUserName) {
            return res.status(500).json({
                success: false,
                message: "This Username Already Exists..."
            })
        }

        const findEmail = await User.findOne({ email });
        if (findEmail) {
            return res.status(500).json({
                success: false,
                message: "This Email Already Exists..."
            })
        }

        if (password.length < 6) {
            return res.status(500).json({
                success: false,
                message: "Password Length Must Be 6 Character..."
            })
        }

        const newUser = await User.create({ userName, email, password });

        const token = await generateToken(newUser._id);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true
        });

        return res.status(200).json({
            success: true,
            message: "Signup Successfull...",
            user: newUser
        })
    }

    catch (err) {
        console.log("Signup Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


const Login = async (req, res) => {
    try {
        const { email, password } = req.body

        const findEmail = await User.findOne({ email });
        if (!findEmail) {
            return res.status(500).json({
                success: false,
                message: "This User Does Not Exists..."
            })
        }

        if (password != findEmail.password) {
            return res.status(500).json({
                success: false,
                message: "Incorrect Password..."
            })
        }

        const token = await generateToken(findEmail._id);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true
        });

        return res.status(200).json({
            success: true,
            message: "Login Successfull...",
            user: findEmail
        })
    }

    catch (err) {
        console.log("Login Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


const Logout = async (req, res) => {
    try {
        res.clearCookie("token");

        return res.status(200).json({
            success: true,
            message: "Logout Successfull...",
        })
    }

    catch (err) {
        console.log("Logout Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = { SignUp, Login, Logout };
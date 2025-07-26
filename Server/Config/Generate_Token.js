const jwt = require("jsonwebtoken");

const generateToken = async (userId) => {
    try {
        const token = await jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return token; 
    }

    catch (err) {
        console.log("GenerateToken Error :", err.message);
    }
}

module.exports = generateToken
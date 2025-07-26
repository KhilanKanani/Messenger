const express = require("express");
// Connect Database
const connectDB = require("./Config/DataBase");
// Import Cookieparser - Make a Generate Token
const cookieParser = require("cookie-parser");
// Import Dotenv - Store Hidden Data
const dotenv = require("dotenv");
dotenv.config();
// Import Cors - Connect Client
const cors = require("cors");
// Authentication Router
const authRoute = require("./Routes/Auth_Route");
// User Router
const userRoute = require('./Routes/User_Route');
// Message Route
const messageRoute = require("./Routes/Message_Route");
// Use Socket.Io
const { server, app } = require("./Socket/Socket");

// This app Is Index File And Me Use Socket.Io App
// const app = express();
const port = process.env.PORT;

app.use(cors({ origin: `${process.env.CLIENT_URL}`, credentials: true }))

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);
 
server.listen(port, () => {
    connectDB();
    console.log(`Your App Running In Port Number ${port}...`);
}) 
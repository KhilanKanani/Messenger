const UploadOnCloudinary = require("../Config/Image_Cloudinary");
const Conversation = require("../Model/Conversation_Model");
const Message = require("../Model/Message_Model");
const { getReceiverSocketId, io } = require("../Socket/Socket");

const SendMessage = async (req, res) => {
    try {
        let sender = req.userId;
        let receiver = req.params.receiverId;
        let { message } = req.body;
        let image;

        if (req.file) {
            image = await UploadOnCloudinary(req.file.path);
        }

        // Find Karo Ke Sender And Receivere Last Chat Kari Chhe Ke NewUser Chhe
        let conversation = await Conversation.findOne({ participaint: { $all: [sender, receiver] } });

        // Make a New Message
        let newMessage = await Message.create({ sender, receiver, message, image });

        if (!conversation) {
            conversation = await Conversation.create({
                participaint: [sender, receiver],
                messages: [newMessage._id]
            });
        }
        else {
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }

        const recriverSocketId = getReceiverSocketId(receiver);

        if (recriverSocketId) {
            io.to(recriverSocketId).emit("newMessage", newMessage);
        }

        return res.status(200).json({
            success: true,
            Messages: newMessage
        })
    }

    catch (err) {
        console.log("Sender Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const GetMessages = async (req, res) => {
    try {
        let sender = req.userId;
        let receiver = req.params.receiverId;

        // Find Karo Ke Sender And Receivere Last Chat Kari Chhe Ke NewUser Chhe
        let conversation = await Conversation.findOne({ participaint: { $all: [sender, receiver] } }).populate("messages");

        return res.status(200).json({
            success: true,
            Messages: conversation?.messages || []
        })
    }

    catch (err) {
        console.log("GetMessage Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = { SendMessage, GetMessages };
import getUserDataFromRequest from "../helpers/getUserDataFromRequest.js";
import Message from "../models/message.model.js";
const getSelectedUsersmessages = async (req, res) => {
    const { userId } = req.params;
    const userData = await getUserDataFromRequest(req);
    const messages = await Message.find({
        sender: { $in: [userId, userData.userId] },
        recipient: { $in: [userId, userData.userId] },
    });
    res.status(200).json({
        success: true,
        message: "User Messages",
        messages
    });
};

const createmessage = async () => { };
const deletemessage = async (req, res) => {
    const { messageId } = req.params;
    await Message.findByIdAndDelete(messageId);
    const { userId } = await getUserDataFromRequest(req);
    await Message.findOneAndDelete({ sender: userId, _id: messageId });

    res.status(200).json({
        success: true,
        message: "Message deleted"
    });

};

export { getSelectedUsersmessages, createmessage, deletemessage };
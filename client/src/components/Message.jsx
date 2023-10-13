import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import axiosInstance from "../helpers/axiosInstance";
import { useSelector } from "react-redux";

const Message = ({ message, selectedUserId, getMessages }) => {
    const [isDeleteShow, setIsDeleteShow] = useState(false);

    const { id } = useSelector(state => state.auth);

    const getDate = (createdAt) => {
        const date = new Date(createdAt);
        return `${date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;
    };

    const handleDelete = async (messageId) => {
        if (selectedUserId) {
            await axiosInstance.delete(`/messages/${messageId}`);
            getMessages();
            // setMessages(data.messages);
        }
    };

    return (
        <div className={`${message.sender === id ? "justify-end" : "justify-start"} flex`}>
            <div onMouseOver={() => setIsDeleteShow(true)} onMouseLeave={() => setIsDeleteShow(false)} className={`py-3 px-3 my-2 inline-block max-w-md rounded-md text-sm ${message.sender === id ? "bg-blue-500 text-white" : "bg-white text-gray-500"}`}>
                <div className="flex pr-7 relative">
                    {message.text}
                    <div className="text-[10px] text-gray-300 absolute -bottom-[12px] -right-1">
                        {getDate(message.createdAt)}
                    </div>
                    <div onClick={() => handleDelete(message?._id)} className={`${(isDeleteShow && message.sender === id) ? "" : "hidden"} cursor-pointer text-lg text-gray-300 absolute -top-[10px] -right-2`}>
                        <MdDelete />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;
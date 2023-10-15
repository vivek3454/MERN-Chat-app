import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { ImCross } from "react-icons/im";
import axiosInstance from "../helpers/axiosInstance";
import { useSelector } from "react-redux";
import Modal from "react-modal";

const Message = ({ message, selectedUserId, getMessages }) => {
    const [isDeleteShow, setIsDeleteShow] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const { id } = useSelector(state => state.auth);

    const getDate = (createdAt) => {
        const date = new Date(createdAt);
        return `${date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;
    };

    const handleDelete = async (messageId) => {
        if (selectedUserId) {
            await axiosInstance.delete(`/messages/${messageId}`);
            getMessages();
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    return (
        <>
            <div className={`${message.sender === id ? "justify-end" : "justify-start"} flex`}>
                <div onMouseOver={() => setIsDeleteShow(true)} onMouseLeave={() => setIsDeleteShow(false)} className={`${message.text ? "p-3" : "p-2"} my-2 inline-block max-w-md rounded-md text-sm ${message.sender === id ? "bg-blue-500 text-white" : "bg-white text-gray-500"}`}>
                    <div className={`flex ${message.text && "pr-7"} relative`}>
                        {message.text && <p>{message.text}</p>}
                        {message.file &&
                            <div className={"flex"}>
                                <img src={message?.file} onClick={openModal} className="w-60 rounded cursor-pointer" alt="image" />
                            </div>
                        }
                        <div className={`text-[10px] text-gray-300 absolute ${message.text ? "-bottom-[12px] -right-1" : "bottom-[1px] right-[5px]"}`}>
                            {getDate(message.createdAt)}
                        </div>
                        <div onClick={() => handleDelete(message?._id)} className={`${(isDeleteShow && message.sender === id) ? "" : "hidden"} cursor-pointer text-lg text-gray-300 absolute ${message.text ? "-top-[10px] -right-2" : "top-[3px] right-1"}`}>
                            <MdDelete />
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                shouldCloseOnOverlayClick
                shouldCloseOnEsc
                className={"bg-black/60 w-full h-screen flex justify-center items-center text-white"}
            >
                <ImCross className="absolute top-2 right-5 text-3xl cursor-pointer" onClick={closeModal} />
                <img src={message.file} className="min-w-lg max-h-96 w-fit" alt="" />
            </Modal>
        </>
    );
};

export default Message;
import React, { useEffect, useRef, useState } from "react";
import { MdSend, MdArrowCircleLeft } from "react-icons/md";
import Avatar from "./Avatar";
import Logo from "./Logo";
import axiosInstance from "../helpers/axiosInstance";
import { useSelector } from "react-redux";
import { uniqBy } from "lodash";

const Chat = () => {
    const [ws, setWs] = useState();
    const [onlineUsers, setOnlineUsers] = useState({});
    const [selectedUserId, setSelectedUserId] = useState("");
    const [newMessageText, setNewMessageText] = useState("");
    const [messages, setMessages] = useState([]);

    const messageBoxRef = useRef();

    const { username, id } = useSelector(state => state.auth);

    useEffect(() => {
        connectionToWs();
    }, []);

    const connectionToWs = () => {
        const ws = new WebSocket("ws://localhost:5000");
        setWs(ws);
        ws.addEventListener("message", handleMessage);
        ws.addEventListener("close", () => {
            setTimeout(() => {
                connectionToWs();
            }, 1000);
        }
        );
    };
    const showOnlinePeople = (userArr) => {
        const users = {};
        userArr.forEach(({ userId, username }) => {
            users[userId] = username;
        });
        setOnlineUsers(users);
    };

    const handleMessage = (e) => {
        const messageData = JSON.parse(e.data);
        console.log(e, messageData);
        if ("online" in messageData) {
            showOnlinePeople(messageData.online);
        }
        else if ("text" in messageData) {
            setMessages(prev => [...prev, { ...messageData }]);
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (newMessageText) {
            ws.send(JSON.stringify({
                recipient: selectedUserId,
                text: newMessageText
            }));
            setNewMessageText("");
            setMessages(prev => [...prev, {
                text: newMessageText,
                sender: id,
                recipient: selectedUserId,
                id: Date.now()
            }]);
        }
    };

    useEffect(() => {
        const div = messageBoxRef?.current;
        if (div) {
            div.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [messages]);

    useEffect(() => {
        (async () => {
            if (selectedUserId) {
                const { data } = await axiosInstance.get(`/messages/${selectedUserId}`);
                setMessages(data.messages);
            }
        })();

    }, [selectedUserId]);


    const onlineUsersExclCurrUser = { ...onlineUsers };
    delete onlineUsersExclCurrUser[id];

    const messagesWithoutDupes = uniqBy(messages, "_id");

    return (
        <section className="flex h-screen">
            <aside className="bg-blue-100 w-1/4">
                <Logo />
                {Object.keys(onlineUsersExclCurrUser).map((userId) => (
                    <div onClick={() => setSelectedUserId(userId)} className={`flex items-center gap-4 border-b border-gray-400 cursor-pointer ${userId === selectedUserId ? "bg-blue-200" : ""}`} key={userId}>
                        {userId === selectedUserId &&
                            <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>
                        }
                        <div className="flex items-center gap-4 py-2 pl-4 ">
                            <Avatar username={onlineUsers[userId]} userId={userId} />
                            <span className="text-gray-800">{onlineUsers[userId]}</span>
                        </div>
                    </div>
                ))}
            </aside>
            <main className="bg-blue-200 w-3/4 relative">
                <div>
                    {!selectedUserId &&
                        <div className="flex items-center justify-center h-screen text-gray-400">
                            <MdArrowCircleLeft size={25} className="mr-1" /> Select a chat
                        </div>
                    }
                    {selectedUserId &&
                        <div className="px-5 h-[90vh] overflow-y-scroll">
                            {messagesWithoutDupes.map((message, i) => (
                                <div key={i} className={`${message.sender === id ? "text-right" : "text-left"}`}>
                                    <div className={`py-2 px-3 my-2 inline-block rounded-md text-sm ${message.sender === id ? "bg-blue-400 text-white" : "bg-white text-gray-500"}`}>
                                        {message.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messageBoxRef}></div>
                        </div>
                    }
                </div>
                {selectedUserId && <form onSubmit={sendMessage} className="flex items-center absolute bottom-1 left-0 w-full">
                    <input onChange={(e) => setNewMessageText(e.target.value)} value={newMessageText} type="text" placeholder="Enter Message" className="bg-white p-4 w-full border border-gray-400 outline-none" />
                    <button className="bg-blue-500 p-4 text-white">
                        <MdSend size={25} />
                    </button>
                </form>}
            </main>
        </section>
    );
};

export default Chat;
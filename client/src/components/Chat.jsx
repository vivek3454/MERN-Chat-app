import React, { useEffect, useRef, useState } from "react";
import { MdSend, MdArrowCircleLeft } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import axiosInstance from "../helpers/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { uniqBy } from "lodash";
import Avatar from "./Avatar";
import Logo from "./Logo";
import Message from "./Message";
import Contact from "./Contact";
import toast from "react-hot-toast";

const Chat = () => {
    const [ws, setWs] = useState();
    const [onlineUsers, setOnlineUsers] = useState({});
    const [offlineUsers, setOfflineUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [newMessageText, setNewMessageText] = useState("");
    const [messages, setMessages] = useState([]);

    const messageBoxRef = useRef();
    const dispatch = useDispatch();

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
        if ("online" in messageData) {
            showOnlinePeople(messageData.online);
        }
        else if ("text" in messageData) {
            setMessages(prev => [...prev, { ...messageData }]);
            getMessages();
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
            getMessages();
        }
    };

    useEffect(() => {
        const div = messageBoxRef?.current;
        if (div) {
            div.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [messages]);

    const getMessages = async () => {
        if (selectedUserId) {
            const { data } = await axiosInstance.get(`/messages/${selectedUserId}`);
            setMessages(data.messages);
        }
    };
    const handleLogout = async () => {
        toast.loading("loading");
        await axiosInstance.post("/user/logout", );
        setWs(null);
        toast.dismiss();
        toast.success("logged out");
        dispatch(logout());
    };

    useEffect(() => {
        getMessages();
    }, [selectedUserId]);

    useEffect(() => {
        (async () => {
            const { data } = await axiosInstance.get("user/allusers");
            const offlineUsers = {};
            data.users
                .filter((user) => user._id !== id)
                .filter((user) => !Object.keys(onlineUsers).includes(user._id))
                .forEach(user => {
                    offlineUsers[user._id] = user;
                });
            setOfflineUsers(offlineUsers);
        })();
    }, [onlineUsers]);


    const onlineUsersExclCurrUser = { ...onlineUsers };
    delete onlineUsersExclCurrUser[id];
    const messagesWithoutDupes = uniqBy(messages, "_id");

    return (
        <section className="flex h-screen">
            <aside className="bg-white w-1/4 flex flex-col justify-between">
                <div className="overflow-y-auto">
                    <Logo />
                    {Object.keys(onlineUsersExclCurrUser).map((userId, i) => (
                        <Contact
                            key={i}
                            online={true}
                            userId={userId}
                            selectedUserId={selectedUserId}
                            setSelectedUserId={setSelectedUserId}
                            username={onlineUsersExclCurrUser[userId]}
                        />
                    ))}
                    {Object.keys(offlineUsers).map((userId, i) => (
                        <Contact
                            key={i}
                            online={false}
                            userId={userId}
                            selectedUserId={selectedUserId}
                            setSelectedUserId={setSelectedUserId}
                            username={offlineUsers[userId].username}
                        />
                    ))}
                </div>
                <div className="w-full text-center mb-5 flex justify-center items-center">
                    <span className="mr-3 flex items-center gap-1 text-gray-600">
                        <FaUser />
                        {username}
                    </span>
                    <button onClick={handleLogout} className="px-3 py-1 bg-blue-400 rounded-md hover:bg-blue-500 text-white">logout</button>
                </div>
            </aside>
            <main className="bg-blue-100 w-3/4 relative">
                <div>
                    {!selectedUserId &&
                        <div className="flex items-center justify-center h-screen text-gray-400">
                            <MdArrowCircleLeft size={25} className="mr-1" /> Select a chat
                        </div>
                    }
                    {selectedUserId &&
                        <>
                            <div className="flex items-center gap-4 py-[14px] pl-4 bg-white">
                                <Avatar username={onlineUsers[selectedUserId] ? onlineUsers[selectedUserId] : offlineUsers[selectedUserId].username} userId={selectedUserId} online={onlineUsers[selectedUserId] ? true : false} />
                                <span className="text-gray-800">{onlineUsers[selectedUserId] ? onlineUsers[selectedUserId] : offlineUsers[selectedUserId].username}</span>
                            </div>
                            <div className="px-5 h-[90vh] overflow-y-scroll">
                                {messagesWithoutDupes.map((message, i) => (
                                    <Message key={i} message={message} selectedUserId={selectedUserId} getMessages={getMessages} />
                                ))}
                                <div ref={messageBoxRef}></div>
                            </div>
                        </>
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
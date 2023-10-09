import React, { useEffect, useState } from "react";
import { MdSend, MdArrowCircleLeft } from "react-icons/md";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { useSelector } from "react-redux";

const Chat = () => {
    const [ws, setWs] = useState();
    const [onlineUsers, setOnlineUsers] = useState({});
    const [selectedUserId, setSelectedUserId] = useState("");
    const { username, id } = useSelector(state => state.auth);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:5000");
        setWs(ws);
        ws.addEventListener("message", handleMessage);
    }, []);

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
    };

    const onlineUsersExclCurrUser = { ...onlineUsers };
    delete onlineUsersExclCurrUser[id];

    return (
        <section className="flex h-screen">
            <aside className="bg-blue-100 w-1/4">
                <Logo />
                {Object.keys({ userId: "sei363", username: "hello" }).map((userId) => (
                    <div onClick={() => setSelectedUserId(userId)} className={`flex items-center gap-4 border-b border-gray-400 cursor-pointer ${userId === selectedUserId ? "bg-blue-200" : ""}`} key={userId}>
                        {userId === selectedUserId &&
                            <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>
                        }
                        <div className="flex items-center gap-4 py-2 pl-4 ">
                            {/* <Avatar username={onlineUsers[userId]} userId={userId} /> */}
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
                </div>
                <div className="flex items-center absolute bottom-1 left-0 w-full">
                    <input type="text" placeholder="Enter Message" className="bg-white p-4 w-full border border-gray-400 outline-none" />
                    <button className="bg-blue-500 p-4 text-white">
                        <MdSend size={25} />
                    </button>
                </div>
            </main>
        </section>
    );
};

export default Chat;
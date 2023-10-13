import React from "react";
import Avatar from "./Avatar";

const Contact = ({userId, setSelectedUserId, selectedUserId, username, online}) => {
    return (
        <div onClick={() => setSelectedUserId(userId)} className={`flex items-center gap-4 cursor-pointer ${userId === selectedUserId ? "bg-blue-50" : ""}`} key={userId}>
            {userId === selectedUserId &&
                <div className="w-1 bg-blue-500 h-14 rounded-r-md"></div>
            }
            <div className="flex items-center gap-4 py-2 pl-4 ">
                <Avatar username={username} userId={userId} online={online} />
                <span className="text-gray-800">{username}</span>
            </div>
        </div>
    );
};

export default Contact;
import React from "react";

const Avatar = ({ username, userId, online }) => {
    const colors = ["bg-red-200", "bg-green-200", "bg-purple-200", "bg-blue-200", "bg-yellow-200", "bg-teal-200"];
    const userIdBase10 = parseInt(userId, 16);
    const colorIndex = userIdBase10 % colors.length;
    const color = colors[colorIndex];
    return (
        <div className={`w-10 h-10 font-semibold rounded-full flex justify-center items-center ${color} relative`}>
            {username[0]}
            {online && (<div className="w-3 h-3 bg-green-400 rounded-full absolute bottom-0 right-0 border border-white"></div>)}
        </div>
    );
};

export default Avatar;
import React from "react";
import { MdChat } from "react-icons/md";

const Logo = () => {
    return (
        <div className="text-blue-500 p-5 flex items-center gap-2 font-bold text-xl sticky top-0 bg-white z-10 shadow-md">
            <MdChat />
            Mern Chat
        </div>
    );
};

export default Logo;
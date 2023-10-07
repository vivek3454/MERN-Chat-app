import React from "react";
import RegisterAndLogin from "../pages/RegisterAndLogin";
import { useSelector } from "react-redux";
import Chat from "../components/Chat";

const Routes = () => {
    const { username, id } = useSelector((state) => state.auth);
    if (username) {
        return (
            <Chat />
        );
    }
    return (
        <RegisterAndLogin />
    );
};

export default Routes;
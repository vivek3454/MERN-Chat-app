import React from "react";
import Signup from "../pages/Signup";
import { useSelector } from "react-redux";

const Routes = () => {
    const { username, id } = useSelector((state) => state.auth);
    if (username) {
        return (
            <h1>login</h1>
        );
    }
    return (
        <Signup />
    );
};

export default Routes;
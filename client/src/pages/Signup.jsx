import React, { useState } from "react";
import axiosInstance from "../helpers/axiosInstance";
import toast from "react-hot-toast";

const Signup = () => {
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });

  const handleOnChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    let res = axiosInstance.post("/user/register", userInfo);
    toast.promise(res, {
      loading: "Loading",
      success: ({data}) =>{
        return data.message;
      },
      error: (err) => {
        return err.response.data.message;
      },
    });
    res = await res;
  };

  return (
    <div className="bg-blue-50 w-full h-screen flex items-center">
      <form onSubmit={handleRegister} className="w-64 mx-auto">
        <input value={userInfo.username} onChange={handleOnChange} type="text" name="username" id="username" placeholder="username" className="w-full outline-blue-500 p-2 rounded-sm mb-2 border-2" />
        <input value={userInfo.password} onChange={handleOnChange} type="password" name="password" id="password" placeholder="password" className="w-full outline-blue-500 p-2 rounded-sm mb-2 border-2" />
        <button className="bg-blue-500 w-full py-2 text-white rounded active:bg-blue-500 hover:bg-blue-600">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
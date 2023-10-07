import React, { useState } from "react";
import axiosInstance from "../helpers/axiosInstance";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";

const Register = () => {
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });
  const [isRegisterOrLogin, setIsRegisterOrLogin] = useState("register");
  const dispatch = useDispatch();


  const handleOnChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isRegisterOrLogin === "register") {
      let res = axiosInstance.post("/user/register", userInfo);
      toast.promise(res, {
        loading: "Loading",
        success: ({ data }) => {
          dispatch(login({ username: data.user.username, id: data.user._id }));
          return data.message;
        },
        error: (err) => {
          return err.response.data.message;
        },
      });
    }
    else {
      let res = axiosInstance.post("/user/login", userInfo);
      toast.promise(res, {
        loading: "Loading",
        success: ({ data }) => {
          dispatch(login({ username: data.user.username, id: data.user._id }));
          return data.message;
        },
        error: (err) => {
          return err.response.data.message;
        },
      });

    }
  };

  return (
    <div className="bg-blue-50 w-full h-screen flex items-center">
      <form onSubmit={handleRegister} className="w-64 mx-auto">
        <input value={userInfo.username} onChange={handleOnChange} type="text" name="username" id="username" placeholder="username" className="w-full outline-blue-500 p-2 rounded-sm mb-2 border-2" />
        <input value={userInfo.password} onChange={handleOnChange} type="password" name="password" id="password" placeholder="password" className="w-full outline-blue-500 p-2 rounded-sm mb-2 border-2" />
        <button className="bg-blue-500 w-full py-2 text-white rounded active:bg-blue-500 hover:bg-blue-600">

          {isRegisterOrLogin === "register" ? "Register" : "Login"}
        </button>
        <div className="mt-4">
          {isRegisterOrLogin === "register" && <div>
            Already have an account?
            <button type="button" onClick={() => setIsRegisterOrLogin("login")} className="ml-2 text-blue-600 hover:underline">Login</button>
          </div>
          }
          {isRegisterOrLogin === "login" && <div>
            Do not have an account?
            <button type="button" onClick={() => setIsRegisterOrLogin("register")} className="ml-2 text-blue-600 hover:underline">Register</button>
          </div>
          }
        </div>
      </form>
    </div>
  );
};

export default Register;